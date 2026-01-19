import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoService } from "../../shared/mongo.service";
import {
    SinapiFilters,
    SinapiListOutput,
    SinapiItemDetails,
    SinapiScenario,
    SinapiItemType
} from "@repo/contracts";

@Injectable()
export class SinapiProviderService {
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

    async listItems(filters: SinapiFilters): Promise<SinapiListOutput> {
        const { q, uf, cenario, referencia, page, limit } = filters;
        const ref = referencia || "2025-12";
        const collectionName = this.getCollectionName(ref);
        const collection = this.mongoService.getCollection(collectionName);

        const query: any = {};
        if (q) {
            // If q looks like a code, search by code too
            if (/^\d+$/.test(q)) {
                query.$or = [
                    { codigo: { $regex: q, $options: "i" } },
                    { descricao: { $regex: q, $options: "i" } }
                ];
            } else {
                query.descricao = { $regex: q, $options: "i" };
            }
        }

        const total = await collection.countDocuments(query);
        const cursor = collection.find(query)
            .sort({ descricao: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const rawItems = await cursor.toArray();

        const items = rawItems.map(item => ({
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            tipo: item.tipo as SinapiItemType,
            preco: item.scenarios?.[cenario]?.[uf] ?? null,
        }));

        return { items, total, page: Number(page), limit: Number(limit) };
    }

    async getDetails(
        codigo: string,
        uf: string,
        cenario: SinapiScenario,
        referencia: string
    ): Promise<SinapiItemDetails> {
        const collectionName = this.getCollectionName(referencia);
        const collection = this.mongoService.getCollection(collectionName);

        const item: any = await collection.findOne({ codigo, referencia });
        if (!item) {
            throw new NotFoundException(`Item SINAPI ${codigo} não encontrado na referência ${referencia}`);
        }

        const resolvedPreco = item.scenarios?.[cenario]?.[uf] ?? null;

        const details: SinapiItemDetails = {
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            tipo: item.tipo as SinapiItemType,
            preco: resolvedPreco,
            referencia: item.referencia,
            uf,
            cenario,
        };

        if (item.itens && item.itens.length > 0) {
            // Resolve prices for children in 1st level
            details.itens = await Promise.all(item.itens.map(async (child: any) => {
                let childPrice = null;
                if (child.codigo) {
                    const childItem: any = await collection.findOne({ codigo: child.codigo, referencia });
                    childPrice = childItem?.scenarios?.[cenario]?.[uf] ?? null;
                }

                return {
                    ...child,
                    precoUnitario: childPrice,
                    precoTotal: childPrice !== null ? Number((childPrice * child.coeficiente).toFixed(4)) : null,
                };
            }));
        }

        return details;
    }

    async resolvePrice(codigo: string, uf: string, cenario: SinapiScenario, referencia: string): Promise<number | null> {
        const collectionName = this.getCollectionName(referencia);
        const collection = this.mongoService.getCollection(collectionName);

        const item: any = await collection.findOne({ codigo, referencia }, { projection: { scenarios: 1 } });
        if (!item) return null;

        return item.scenarios?.[cenario]?.[uf] ?? null;
    }
}
