import { z } from "zod";

export enum TipoInsumo {
  MATERIAL = "MATERIAL",
  MAO_DE_OBRA = "MAO_DE_OBRA",
  EQUIPAMENTO = "EQUIPAMENTO",
  SERVICO = "SERVICO",
}

export const InsumoSchema = z.object({
  id: z.string().uuid(),
  codigo: z.string(),
  descricao: z.string(),
  unidade: z.string(),
  preco: z.coerce.number(), // Decimal can arrive as string
  tipo: z.nativeEnum(TipoInsumo),
  tabelaId: z.string().uuid(),
});

export const ComposicaoSchema = z.object({
  id: z.string().uuid(),
  codigo: z.string(),
  descricao: z.string(),
  unidade: z.string(),
  precoTotal: z.coerce.number(),
  tabelaId: z.string().uuid(),
});

export const ItemOrcamentoSchema = z.object({
  id: z.string().uuid(),
  ordem: z.number(),
  codigo: z.string(),
  descricao: z.string(),
  unidade: z.string(),
  quantidade: z.number(),
  valorUnitario: z.number(),
  valorTotal: z.number(),
  origem: z.string(),
});

export const EtapaSchema = z.object({
  id: z.string().uuid(),
  ordem: z.number(),
  nome: z.string(),
  itens: z.array(ItemOrcamentoSchema).optional(),
});

export const OrcamentoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  dataBaseMonth: z.number(),
  dataBaseYear: z.number(),
  bdi: z.number().nullable().optional(),
  encargos: z.number().nullable().optional(),
  total: z.number(),
  etapas: z.array(EtapaSchema).optional(),
});

// ... (Existing schemas)

export const CreateOrcamentoInputSchema = z.object({
  obraId: z.string().uuid(),
  nome: z.string().min(1),
  dataBaseMonth: z.number().min(1).max(12),
  dataBaseYear: z.number().min(2000).max(2100),
  bdi: z.number().optional(),
  encargos: z.number().optional(),
  // Initial items optional
});

export const EtapaInputSchema = z.object({
  ordem: z.number(),
  nome: z.string(),
  itens: z.array(
    z.object({
      ordem: z.number(),
      codigo: z.string(),
      descricao: z.string(),
      unidade: z.string(),
      quantidade: z.number(),
      valorUnitario: z.number(),
      valorTotal: z.number(), // Calculated by client or server? Client should send expected total for validation.
      origem: z.string(),
      insumoId: z.string().uuid().optional(),
      composicaoId: z.string().uuid().optional(),
    }),
  ),
});

export const UpdateOrcamentoItemsInputSchema = z.object({
  etapas: z.array(EtapaInputSchema),
  total: z.number(), // Expected new total
});

export type CreateOrcamentoInput = z.infer<typeof CreateOrcamentoInputSchema>;
export type UpdateOrcamentoInput = z.infer<typeof UpdateOrcamentoItemsInputSchema>;
export type EtapaInput = z.infer<typeof EtapaInputSchema>;

export const TabelaReferenciaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  mes: z.number(),
  ano: z.number(),
  createdAt: z.coerce.date(),
});

export const CreateTabelaInputSchema = z.object({
  nome: z.string().min(3),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2000).max(2100),
});

export type TabelaReferencia = z.infer<typeof TabelaReferenciaSchema>;
export type CreateTabelaInput = z.infer<typeof CreateTabelaInputSchema>;

// Search DTOs
export const SearchItemDTO = z.object({
  q: z.string().min(1), // query
  type: z.enum(["INSUMO", "COMPOSICAO", "ALL"]).default("ALL"),
  tabelaId: z.string().uuid().optional(),
});

export const SearchItemResultSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  descricao: z.string(),
  unidade: z.string(),
  preco: z.number(),
  tipo: z.enum(["INSUMO", "COMPOSICAO"]),
  origem: z.string(),
});

export type SearchItemResult = z.infer<typeof SearchItemResultSchema>;

export const ComposicaoItemSchema = z.object({
  id: z.string().uuid(),
  quantidade: z.coerce.number(),
  insumo: InsumoSchema.nullable().optional(),
  composicaoFilha: ComposicaoSchema.nullable().optional(),
});

export const ComposicaoDetalheSchema = ComposicaoSchema.extend({
  itens: z.array(ComposicaoItemSchema).optional(),
});

export const GetComposicaoOutputSchema = z.object({
  header: InsumoSchema,
  details: ComposicaoDetalheSchema.nullable().optional(),
});

export type GetComposicaoOutput = z.infer<typeof GetComposicaoOutputSchema>;
