import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../../shared/prisma.service";
import * as xlsx from "xlsx";
import { TipoInsumo } from "@repo/contracts"; // Use from contracts

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

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
