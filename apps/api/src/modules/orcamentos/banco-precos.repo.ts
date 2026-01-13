import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";

@Injectable()
export class BancoPrecosRepo {
  constructor(private readonly prisma: PrismaService) {}

  async searchInsumos(term: string, tabelaId?: string) {
    return this.prisma.insumo.findMany({
      where: {
        ...(tabelaId ? { tabelaId } : {}),
        OR: [
          { descricao: { contains: term, mode: "insensitive" } },
          { codigo: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 20,
    });
  }

  async searchComposicoes(term: string, tabelaId?: string) {
    return this.prisma.composicao.findMany({
      where: {
        ...(tabelaId ? { tabelaId } : {}),
        OR: [
          { descricao: { contains: term, mode: "insensitive" } },
          { codigo: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 20,
    });
  }

  async findInsumoById(id: string) {
    return this.prisma.insumo.findUnique({
      where: { id },
    });
  }

  async findComposicaoByCodigo(codigo: string, tabelaId?: string) {
    return this.prisma.composicao.findFirst({
      where: {
        codigo,
        ...(tabelaId ? { tabelaId } : {}),
      },
      include: {
        itens: {
          include: {
            insumo: true,
            composicaoFilha: true,
          },
        },
      },
    });
  }
}
