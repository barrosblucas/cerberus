import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { CreateOrcamentoInput, UpdateOrcamentoInput } from "@repo/contracts";

@Injectable()
export class OrcamentosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrcamentoInput) {
    return this.prisma.orcamento.create({
      data: {
        nome: data.nome,
        dataBaseMonth: data.dataBaseMonth,
        dataBaseYear: data.dataBaseYear,
        bdi: data.bdi ?? 0,
        encargos: data.encargos ?? 0,
        total: 0,
        obraId: data.obraId,
      },
    });
  }

  async getByObra(obraId: string) {
    return this.prisma.orcamento.findMany({
      where: { obraId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOne(id: string) {
    return this.prisma.orcamento.findUnique({
      where: { id },
      include: {
        etapas: {
          include: { itens: true },
          orderBy: { ordem: "asc" },
        },
      },
    });
  }

  async updateItems(id: string, data: UpdateOrcamentoInput) {
    // FULL SYNC STRATEGY (Transactional)
    return this.prisma.$transaction(async (tx: any) => {
      // Use any or strict Prisma.TransactionClient
      // 1. Verify existence
      const existing = await tx.orcamento.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException("Orcamento not found");

      // 2. Delete all existing Etapas (Cascade deletes Items)
      await tx.etapa.deleteMany({ where: { orcamentoId: id } });

      // 3. Re-create full tree
      for (const etapa of data.etapas) {
        await tx.etapa.create({
          data: {
            orcamentoId: id,
            nome: etapa.nome,
            ordem: etapa.ordem,
            itens: {
              create: etapa.itens.map((item) => ({
                codigo: item.codigo,
                descricao: item.descricao,
                unidade: item.unidade,
                quantidade: item.quantidade,
                valorUnitario: item.valorUnitario,
                valorTotal: item.valorTotal,
                origem: item.origem,
                ordem: item.ordem,
                insumoId: item.insumoId,
                composicaoId: item.composicaoId,
              })),
            },
          },
        });
      }

      // 4. Update Header Total
      return tx.orcamento.update({
        where: { id },
        data: { total: data.total },
      });
    });
  }
}
