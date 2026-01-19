import { Injectable, Logger } from "@nestjs/common";
import { MongoService } from "../../shared/mongo.service";
import * as fs from "fs";
import { SinapiItemType } from "@repo/contracts";

@Injectable()
export class SinapiIngesterService {
    private readonly logger = new Logger(SinapiIngesterService.name);

    constructor(private readonly mongoService: MongoService) { }

    private getCollectionName(referencia: string) {
        const parts = referencia.split("-");
        const year = parts[0];
        const month = parts[1];
        const monthMap: Record<string, string> = {
            "01": "janeiro", "02": "fevereiro", "03": "marco", "04": "abril",
            "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
            "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro",
        };
        const monthLower = month ? (monthMap[month] || "unknown") : "unknown";
        return `${year}_${monthLower}`;
    }

    async ingestFile(filePath: string) {
        this.logger.log(`Starting ingestion of ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const rawData = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(rawData);

        const referencia = data.referencia;
        if (!referencia) {
            throw new Error("Invalid JSON: missing referencia");
        }

        const collectionName = this.getCollectionName(referencia);
        const collection = this.mongoService.getCollection(collectionName);

        // Create indices as per requirements
        // Composite index on { codigo: 1, referencia: 1 } even if in separate collections
        await collection.createIndex({ codigo: 1, referencia: 1 }, { unique: true });

        const operations: any[] = [];

        // Process Insumos
        if (data.insumos) {
            for (const [codigo, insumo] of Object.entries(data.insumos)) {
                const normalizedInsumo = this.normalizeItem(insumo, "INSUMO", referencia);
                operations.push({
                    updateOne: {
                        filter: { codigo: normalizedInsumo.codigo, referencia: normalizedInsumo.referencia },
                        update: { $set: normalizedInsumo },
                        upsert: true,
                    },
                });
            }
        }

        // Process Composições
        if (data.composicoes) {
            for (const [codigo, composicao] of Object.entries(data.composicoes)) {
                const normalizedComp = this.normalizeItem(composicao, "COMPOSICAO", referencia);
                operations.push({
                    updateOne: {
                        filter: { codigo: normalizedComp.codigo, referencia: normalizedComp.referencia },
                        update: { $set: normalizedComp },
                        upsert: true,
                    },
                });
            }
        }

        if (operations.length > 0) {
            this.logger.log(`Executing bulkWrite for ${operations.length} items in collection ${collectionName}...`);
            const chunkSize = 1000;
            for (let i = 0; i < operations.length; i += chunkSize) {
                const chunk = operations.slice(i, i + chunkSize);
                await collection.bulkWrite(chunk);
                this.logger.log(`Progress: ${Math.min(i + chunkSize, operations.length)}/${operations.length}`);
            }
        }

        this.logger.log(`Ingestion completed for ${referencia}`);
        return { success: true, count: operations.length, collection: collectionName };
    }

    private normalizeItem(item: any, tipo: SinapiItemType, referencia: string) {
        const normalized: any = {
            codigo: String(item.codigo),
            descricao: item.descricao,
            unidade: item.unidade,
            tipo,
            referencia,
            scenarios: {} as Record<string, Record<string, number | null>>,
            itens: item.itens || undefined,
            grupo: item.grupo || undefined,
            classificacao: item.classificacao || undefined,
        };

        // Normalize prices/costs in scenarios
        if (item.scenarios) {
            for (const scenarioKey of Object.keys(item.scenarios)) {
                const scenarioData = item.scenarios[scenarioKey];
                normalized.scenarios[scenarioKey] = {};
                for (const uf of Object.keys(scenarioData)) {
                    const val = scenarioData[uf];
                    normalized.scenarios[scenarioKey][uf] = (val === null || val === undefined) ? null : Number(val);
                }
            }
        }

        // Normalize itens in composicao
        if (normalized.itens) {
            normalized.itens = normalized.itens.map((it: any) => ({
                ...it,
                codigo: it.codigo ? String(it.codigo) : null,
                coeficiente: Number(it.coeficiente)
            }));
        }

        return normalized;
    }
}
