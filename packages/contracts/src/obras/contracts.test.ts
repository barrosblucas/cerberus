import { describe, expect, it } from "vitest";
import { CreateObraInputSchema, ObraEnderecoTipo, UpdateObraInputSchema } from "./contracts";

describe("obras contracts", () => {
  it("validates create obra input with address and dotacao", () => {
    const parsed = CreateObraInputSchema.parse({
      nome: "Obra Central",
      descricao: "Reforma da unidade principal",
      localizacao: "Rua Central, 100 - Centro",
      enderecoTipo: ObraEnderecoTipo.URBANO,
      enderecoLogradouro: "Rua Central",
      enderecoNumero: "100",
      enderecoBairro: "Centro",
      enderecoCep: "00000-000",
      dataInicio: "2026-01-10",
      dataPrevisaoTermino: "2026-02-10",
      dotacoes: [
        {
          projetoAtividade: "Projeto 01",
          codigoReduzido: "1234",
          naturezaDespesa: "Investimentos",
        },
      ],
    });

    expect(parsed.enderecoTipo).toBe(ObraEnderecoTipo.URBANO);
    expect(parsed.dotacoes?.length).toBe(1);
  });

  it("allows partial update payloads", () => {
    const parsed = UpdateObraInputSchema.parse({
      nome: "Obra Atualizada",
    });

    expect(parsed.nome).toBe("Obra Atualizada");
  });
});
