import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma.service";
import { CreateOrcamentoInput, UpdateOrcamentoInput, AddSinapiItemInput, SinapiScenario } from "@repo/contracts";
import { SinapiProviderService } from "../sinapi/sinapi-provider.service";

@Injectable()
export class OrcamentosService {
  constructor(
    private prisma: PrismaService,
    private sinapiProvider: SinapiProviderService
  ) { }

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

  async addSinapiItem(orcamentoId: string, input: AddSinapiItemInput) {
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id: orcamentoId },
      select: { dataBaseMonth: true, dataBaseYear: true }
    });
    if (!orcamento) throw new NotFoundException("Orçamento não encontrado");

    // Format reference for SINAPI
    const ref = input.referencia || `${orcamento.dataBaseYear}-${String(orcamento.dataBaseMonth).padStart(2, "0")}`;

    // Get item from SINAPI (we use MS and nao_desonerado as defaults or from global config if available)
    // For now we use hardcoded defaults matching the requirement for "global switch" later
    const details = await this.sinapiProvider.getDetails(input.codigo, "MS", "nao_desonerado", ref);

    return this.prisma.itemOrcamento.create({
      data: {
        etapaId: input.etapaId,
        ordem: 0, // Should be calculated
        codigo: details.codigo,
        descricao: details.descricao,
        unidade: details.unidade,
        quantidade: input.quantidade,
        valorUnitario: details.preco || 0,
        valorTotal: (details.preco || 0) * input.quantidade,
        origem: "SINAPI",
        codigoSinapi: details.codigo,
        referenciaSinapi: ref,
      }
    });
  }

  async updateBudgetPrices(id: string, uf: string, cenario: SinapiScenario) {
    const orcamento = await this.getOne(id);
    if (!orcamento) throw new NotFoundException("Orçamento não encontrado");

    let grandTotal = 0;

    for (const etapa of orcamento.etapas || []) {
      for (const item of etapa.itens || []) {
        let currentItemTotal = Number(item.valorTotal);

        if (item.origem === "SINAPI" && item.codigoSinapi && item.referenciaSinapi) {
          const price = await this.sinapiProvider.resolvePrice(
            item.codigoSinapi,
            uf,
            cenario,
            item.referenciaSinapi
          );

          if (price !== null) {
            const valorTotal = price * Number(item.quantidade);
            await this.prisma.itemOrcamento.update({
              where: { id: item.id },
              data: {
                valorUnitario: price,
                valorTotal: valorTotal
              }
            });
            currentItemTotal = valorTotal;
          }
        }
        grandTotal += currentItemTotal;
      }
    }

    return this.prisma.orcamento.update({
      where: { id },
      data: { total: grandTotal }
    });
  }
}
