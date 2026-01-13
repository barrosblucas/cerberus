import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  GetComposicaoOutput,
  GetComposicaoOutputSchema,
  SearchItemDTO,
  SearchItemResult,
  SearchItemResultSchema,
} from "@repo/contracts";
import { BancoPrecosRepo } from "./banco-precos.repo";

@Injectable()
export class BancoPrecosService {
  constructor(private readonly repo: BancoPrecosRepo) {}

  async search(raw: unknown): Promise<SearchItemResult[]> {
    const parsed = SearchItemDTO.safeParse(raw);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: parsed.error.flatten(),
      });
    }

    const { q, type, tabelaId } = parsed.data;
    if (q.trim().length < 3) return [];

    const results: SearchItemResult[] = [];

    if (type !== "COMPOSICAO") {
      const insumos = await this.repo.searchInsumos(q, tabelaId);
      results.push(
        ...insumos.map((insumo) =>
          SearchItemResultSchema.parse({
            id: insumo.id,
            codigo: insumo.codigo,
            descricao: insumo.descricao,
            unidade: insumo.unidade,
            preco: Number(insumo.preco),
            tipo: "INSUMO",
            origem: "SINAPI",
          }),
        ),
      );
    }

    if (type !== "INSUMO") {
      const composicoes = await this.repo.searchComposicoes(q, tabelaId);
      results.push(
        ...composicoes.map((composicao) =>
          SearchItemResultSchema.parse({
            id: composicao.id,
            codigo: composicao.codigo,
            descricao: composicao.descricao,
            unidade: composicao.unidade,
            preco: Number(composicao.precoTotal),
            tipo: "COMPOSICAO",
            origem: "SINAPI",
          }),
        ),
      );
    }

    return results;
  }

  async getComposicao(id: string): Promise<GetComposicaoOutput> {
    const insumo = await this.repo.findInsumoById(id);
    if (!insumo) {
      throw new NotFoundException("Composição não encontrada no Banco de Preços");
    }

    const composicao = await this.repo.findComposicaoByCodigo(insumo.codigo, insumo.tabelaId);

    const response = {
      header: {
        ...insumo,
        preco: Number(insumo.preco),
      },
      details: composicao
        ? {
            ...composicao,
            precoTotal: Number(composicao.precoTotal),
            itens: composicao.itens.map((item) => ({
              id: item.id,
              quantidade: Number(item.quantidade),
              insumo: item.insumo
                ? {
                    ...item.insumo,
                    preco: Number(item.insumo.preco),
                  }
                : null,
              composicaoFilha: item.composicaoFilha
                ? {
                    ...item.composicaoFilha,
                    precoTotal: Number(item.composicaoFilha.precoTotal),
                  }
                : null,
            })),
          }
        : null,
    };

    return GetComposicaoOutputSchema.parse(response);
  }
}
