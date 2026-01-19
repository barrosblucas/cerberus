import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

async function ingest() {
    const filePath = "/home/thanos/Cerberus/convert_sinapi/json/sinapi_2025_12.json";
    const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
    const dbName = "sinapi";
    const collectionName = "2025_dezembro";

    console.log(`Reading file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    const referencia = data.referencia;

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.createIndex({ codigo: 1, referencia: 1 }, { unique: true });

    const operations: any[] = [];

    // Local normalization function (matching the service logic)
    const normalize = (item: any, tipo: string) => {
        const normalized: any = {
            codigo: String(item.codigo),
            descricao: item.descricao,
            unidade: item.unidade,
            tipo,
            referencia,
            scenarios: {},
            itens: item.itens || undefined,
            grupo: item.grupo || undefined,
            classificacao: item.classificacao || undefined,
        };

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

        if (normalized.itens) {
            normalized.itens = normalized.itens.map((it: any) => ({
                ...it,
                codigo: it.codigo ? String(it.codigo) : null,
                coeficiente: Number(it.coeficiente)
            }));
        }
        return normalized;
    };

    console.log("Preparing operations...");

    if (data.insumos) {
        for (const [codigo, insumo] of Object.entries(data.insumos)) {
            const normalized = normalize(insumo, "INSUMO");
            operations.push({
                updateOne: {
                    filter: { codigo: normalized.codigo, referencia: normalized.referencia },
                    update: { $set: normalized },
                    upsert: true,
                },
            });
        }
    }

    if (data.composicoes) {
        for (const [codigo, composicao] of Object.entries(data.composicoes)) {
            const normalized = normalize(composicao, "COMPOSICAO");
            operations.push({
                updateOne: {
                    filter: { codigo: normalized.codigo, referencia: normalized.referencia },
                    update: { $set: normalized },
                    upsert: true,
                },
            });
        }
    }

    console.log(`Executing bulkWrite for ${operations.length} items...`);
    const chunkSize = 1000;
    for (let i = 0; i < operations.length; i += chunkSize) {
        const chunk = operations.slice(i, i + chunkSize);
        await collection.bulkWrite(chunk);
        console.log(`Progress: ${Math.min(i + chunkSize, operations.length)}/${operations.length}`);
    }

    console.log("Ingestion completed!");
    await client.close();
}

ingest().catch(console.error);
