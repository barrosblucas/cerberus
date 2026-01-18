import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  CreateTabelaInput,
  CreateTabelaInputSchema,
  type DeleteTabelaOutput,
} from "@repo/contracts";
import { PrismaService } from "../../../shared/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";

@Controller("tabelas-referencia")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TabelaReferenciaController {
  constructor(private prisma: PrismaService) { }

  @Post()
  async create(@Body() body: unknown) {
    const data = CreateTabelaInputSchema.parse(body);
    const tabela = await this.prisma.tabelaReferencia.create({
      data,
    });
    return { tabela };
  }

  @Get()
  async list() {
    const tabelas = await this.prisma.tabelaReferencia.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { tabelas };
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<DeleteTabelaOutput> {
    // 1. Check if ANY item of this table is used in any budgets
    const usedInOrcamento = await this.prisma.itemOrcamento.findFirst({
      where: {
        OR: [{ insumo: { tabelaId: id } }, { composicao: { tabelaId: id } }],
      },
    });

    if (usedInOrcamento) {
      throw new BadRequestException(
        "Esta tabela não pode ser excluída pois possui itens vinculados a orçamentos.",
      );
    }

    // 2. Check if ANY item of this table is used in ANY composition (including its own)
    // But wait, if it's used in its OWN compositions, we can delete (cascade).
    // If it's used in compositions of OTHER tables, we should block.
    const usedInOtherTableCompositions = await this.prisma.itemComposicao.findFirst({
      where: {
        OR: [
          {
            insumo: { tabelaId: id },
            composicaoPai: { tabelaId: { not: id } },
          },
          {
            composicaoFilha: { tabelaId: id },
            composicaoPai: { tabelaId: { not: id } },
          },
        ],
      },
    });

    if (usedInOtherTableCompositions) {
      throw new BadRequestException(
        "Esta tabela não pode ser excluída pois possui itens vinculados a composições de outras tabelas.",
      );
    }

    // Now safe to delete
    await this.prisma.tabelaReferencia.delete({
      where: { id },
    });

    return { success: true };
  }
}
