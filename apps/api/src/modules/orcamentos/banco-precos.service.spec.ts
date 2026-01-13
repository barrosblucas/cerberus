import { BancoPrecosService } from "./banco-precos.service";
import { BancoPrecosRepo } from "./banco-precos.repo";

function createService() {
  const repo = {
    searchInsumos: jest.fn(),
    searchComposicoes: jest.fn(),
    findInsumoById: jest.fn(),
    findComposicaoByCodigo: jest.fn(),
  } as unknown as BancoPrecosRepo;

  return {
    repo,
    service: new BancoPrecosService(repo),
  };
}

describe("BancoPrecosService", () => {
  it("returns empty list for short queries", async () => {
    const { service } = createService();

    const result = await service.search({ q: "ab" });

    expect(result).toEqual([]);
  });

  it("maps search results to contract shape", async () => {
    const { service, repo } = createService();

    repo.searchInsumos = jest.fn().mockResolvedValue([
      {
        id: "11111111-1111-1111-1111-111111111111",
        codigo: "0001",
        descricao: "Cimento",
        unidade: "KG",
        preco: 1.5,
      },
    ]);

    repo.searchComposicoes = jest.fn().mockResolvedValue([
      {
        id: "22222222-2222-2222-2222-222222222222",
        codigo: "C001",
        descricao: "Concreto",
        unidade: "M3",
        precoTotal: 250.75,
      },
    ]);

    const result = await service.search({ q: "con", type: "ALL" });

    expect(result).toHaveLength(2);
    expect(result[0]?.tipo).toBe("INSUMO");
    expect(result[0]?.preco).toBe(1.5);
    expect(result[1]?.tipo).toBe("COMPOSICAO");
    expect(result[1]?.preco).toBe(250.75);
  });

  it("returns composicao details with numeric values", async () => {
    const { service, repo } = createService();

    repo.findInsumoById = jest.fn().mockResolvedValue({
      id: "33333333-3333-3333-3333-333333333333",
      codigo: "0001",
      descricao: "Composicao base",
      unidade: "M3",
      preco: "100.5",
      tipo: "MATERIAL",
      tabelaId: "44444444-4444-4444-4444-444444444444",
    });

    repo.findComposicaoByCodigo = jest.fn().mockResolvedValue({
      id: "55555555-5555-5555-5555-555555555555",
      codigo: "0001",
      descricao: "Composicao base",
      unidade: "M3",
      precoTotal: "120.0",
      tabelaId: "44444444-4444-4444-4444-444444444444",
      itens: [
        {
          id: "66666666-6666-6666-6666-666666666666",
          quantidade: "2",
          insumo: {
            id: "77777777-7777-7777-7777-777777777777",
            codigo: "0002",
            descricao: "Areia",
            unidade: "M3",
            preco: "10.25",
            tipo: "MATERIAL",
            tabelaId: "44444444-4444-4444-4444-444444444444",
          },
          composicaoFilha: null,
        },
      ],
    });

    const result = await service.getComposicao("insumo-1");

    expect(result.header.preco).toBe(100.5);
    expect(result.details?.precoTotal).toBe(120.0);
    expect(result.details?.itens?.[0]?.quantidade).toBe(2);
    expect(result.details?.itens?.[0]?.insumo?.preco).toBe(10.25);
  });
});
