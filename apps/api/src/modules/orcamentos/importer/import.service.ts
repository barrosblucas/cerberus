import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../../shared/prisma.service";
import * as xlsx from "xlsx";
import { TipoInsumo } from "@repo/contracts";
import { MongoService } from "../../../shared/mongo.service";

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private mongo: MongoService
  ) { }

  private getCollectionName(mes: number, ano: number) {
    const month = String(mes).padStart(2, "0");
    const monthMap: Record<string, string> = {
      "01": "janeiro", "02": "fevereiro", "03": "marco", "04": "abril",
      "05": "maio", "06": "junho", "07": "julho", "08": "agosto",
      "09": "setembro", "10": "outubro", "11": "novembro", "12": "dezembro",
    };
    const monthLower = monthMap[month] || "unknown";
    return `${ano}_${monthLower}`;
  }

  async syncFromMongo(tabelaId: string) {
    const tabela = await this.prisma.tabelaReferencia.findUnique({
      where: { id: tabelaId }
    });

    if (!tabela) throw new BadRequestException("Tabela não encontrada");

    const collectionName = this.getCollectionName(tabela.mes, tabela.ano);
    const collection = this.mongo.getCollection(collectionName);

    const items = await collection.find({}).toArray();

    let savedInsumos = 0;
    let savedComposicoes = 0;

    for (const item of items) {
      if (item.tipo === "INSUMO") {
        await this.prisma.insumo.upsert({
          where: {
            codigo_tabelaId: {
              codigo: item.codigo,
              tabelaId,
            },
          },
          update: {
            descricao: item.descricao,
            unidade: item.unidade,
            preco: item.scenarios?.nao_desonerado?.MS ?? 0,
          },
          create: {
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            preco: item.scenarios?.nao_desonerado?.MS ?? 0,
            tabelaId,
            tipo: TipoInsumo.MATERIAL,
          },
        });
        savedInsumos++;
      } else if (item.tipo === "COMPOSICAO") {
        await this.prisma.composicao.upsert({
          where: {
            codigo_tabelaId: {
              codigo: item.codigo,
              tabelaId,
            },
          },
          update: {
            descricao: item.descricao,
            unidade: item.unidade,
            precoTotal: item.scenarios?.nao_desonerado?.MS ?? 0,
          },
          create: {
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            precoTotal: item.scenarios?.nao_desonerado?.MS ?? 0,
            tabelaId,
          },
        });
        savedComposicoes++;
      }
    }

    return { insumos: savedInsumos, composicoes: savedComposicoes };
  }

  async importInsumos(tabelaId: string, fileBuffer: Buffer) {
    const wb = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = wb.SheetNames[0];

    if (!sheetName) throw new BadRequestException("No sheets found");
    const sheet = wb.Sheets[sheetName];
    if (!sheet) throw new BadRequestException("Sheet not found");

    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) throw new BadRequestException("Empty sheet");

    let savedCount = 0;

    for (const row of data) {
      const codigo = String(row["codigo"] || row["CODIGO"] || "").trim();
      const descricao = String(row["descricao"] || row["DESCRICAO"] || "").trim();
      const unidade = String(row["unidade"] || row["UNIDADE"] || "").trim();
      const preco = Number(row["preco"] || row["PRECO"] || 0);

      // Basic Validation
      if (!codigo || !descricao) continue;

      const existing = await this.prisma.insumo.findFirst({
        where: { codigo, tabelaId },
      });

      if (existing) {
        await this.prisma.insumo.update({
          where: { id: existing.id },
          data: { preco, descricao, unidade },
        });
      } else {
        await this.prisma.insumo.create({
          data: {
            codigo,
            descricao,
            unidade,
            preco,
            tabelaId,
            tipo: TipoInsumo.MATERIAL,
          },
        });
      }
      savedCount++;
    }

    return { count: savedCount };
  }
}
