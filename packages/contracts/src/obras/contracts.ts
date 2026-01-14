import { z } from "zod";

export enum ObraStatus {
  PLANEJAMENTO = "PLANEJAMENTO",
  LICITACAO = "LICITACAO",
  EXECUCAO = "EXECUCAO",
  PARALISADA = "PARALISADA",
  CONCLUIDA = "CONCLUIDA",
}

export enum ObraTipo {
  CONSTRUCAO = "CONSTRUCAO",
  REFORMA = "REFORMA",
  INSTALACAO = "INSTALACAO",
  ELETRICA = "ELETRICA",
  HIDRAULICA = "HIDRAULICA",
  INFRAESTRUTURA = "INFRAESTRUTURA",
  CIVIL = "CIVIL",
  OUTRO = "OUTRO",
}

export enum ObraEnderecoTipo {
  URBANO = "URBANO",
  RURAL = "RURAL",
}

export enum ObraBdiTipo {
  UNICO = "UNICO",
  DIFERENCIADO = "DIFERENCIADO",
}

export enum ObraRecursoTipo {
  PROPRIO = "PROPRIO",
  MISTO = "MISTO",
  FEDERAL = "FEDERAL",
  ESTADUAL = "ESTADUAL",
}

export const ObraDotacaoSchema = z.object({
  id: z.string().uuid(),
  projetoAtividade: z.string().min(1),
  codigoReduzido: z.string().min(1),
  naturezaDespesa: z.string().min(1),
});

export const ObraDotacaoInputSchema = z.object({
  projetoAtividade: z.string().min(1, "Projeto/Atividade é obrigatório"),
  codigoReduzido: z.string().min(1, "Código reduzido é obrigatório"),
  naturezaDespesa: z.string().min(1, "Natureza da despesa é obrigatória"),
});

export const ObraSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  titulo: z.string().nullable().optional(),
  tipo: z.nativeEnum(ObraTipo),
  descricao: z.string().nullable().optional(),
  localizacao: z.string().min(1),
  enderecoTipo: z.nativeEnum(ObraEnderecoTipo).nullable().optional(),
  enderecoLogradouro: z.string().nullable().optional(),
  enderecoNumero: z.string().nullable().optional(),
  enderecoBairro: z.string().nullable().optional(),
  enderecoCep: z.string().nullable().optional(),
  status: z.nativeEnum(ObraStatus),
  dataInicio: z.coerce.date(),
  dataPrevisaoTermino: z.coerce.date(),
  construidoM2: z.coerce.number().nullable().optional(),
  responsavelNome: z.string().nullable().optional(),
  bdiTipo: z.nativeEnum(ObraBdiTipo).nullable().optional(),
  bdiUnicoPercent: z.coerce.number().nullable().optional(),
  bdiMaterialPercent: z.coerce.number().nullable().optional(),
  bdiEquipamentoPercent: z.coerce.number().nullable().optional(),
  bdiMaoDeObraPercent: z.coerce.number().nullable().optional(),
  bdiServicoPercent: z.coerce.number().nullable().optional(),
  bdiTaxaPercent: z.coerce.number().nullable().optional(),
  bdiDescontoPercent: z.coerce.number().nullable().optional(),
  valorTotalObra: z.coerce.number().nullable().optional(),
  valorTotalConvenio: z.coerce.number().nullable().optional(),
  convenio: z.string().nullable().optional(),
  indicacao: z.string().nullable().optional(),
  recurso: z.nativeEnum(ObraRecursoTipo).nullable().optional(),
  possuiContrapartida: z.boolean().nullable().optional(),
  valorContrapartida: z.coerce.number().nullable().optional(),
  avancoFinanceiroPercent: z.coerce.number().nullable().optional(),
  avancoFisicoPercent: z.coerce.number().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  responsavelId: z.string().uuid().nullable().optional(),
  dotacoes: z.array(ObraDotacaoSchema).optional(),
});

export const CreateObraInputSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  titulo: z.string().optional(),
  tipo: z.nativeEnum(ObraTipo).default(ObraTipo.CONSTRUCAO),
  descricao: z.string().optional(),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  enderecoTipo: z.nativeEnum(ObraEnderecoTipo),
  enderecoLogradouro: z.string().min(1, "Logradouro é obrigatório"),
  enderecoNumero: z.string().min(1, "Número é obrigatório"),
  enderecoBairro: z.string().min(1, "Bairro é obrigatório"),
  enderecoCep: z.string().min(1, "CEP é obrigatório"),
  status: z.nativeEnum(ObraStatus).default(ObraStatus.PLANEJAMENTO),
  dataInicio: z.coerce.date({ required_error: "Data de início é obrigatória" }),
  dataPrevisaoTermino: z.coerce.date({ required_error: "Previsão de término é obrigatória" }),
  construidoM2: z.coerce.number().min(0).optional(),
  responsavelNome: z.string().optional(),
  bdiTipo: z.nativeEnum(ObraBdiTipo).default(ObraBdiTipo.UNICO),
  bdiUnicoPercent: z.coerce.number().min(0).max(100).optional(),
  bdiMaterialPercent: z.coerce.number().min(0).max(100).optional(),
  bdiEquipamentoPercent: z.coerce.number().min(0).max(100).optional(),
  bdiMaoDeObraPercent: z.coerce.number().min(0).max(100).optional(),
  bdiServicoPercent: z.coerce.number().min(0).max(100).optional(),
  bdiTaxaPercent: z.coerce.number().min(0).max(100).optional(),
  bdiDescontoPercent: z.coerce.number().min(0).max(100).optional(),
  valorTotalObra: z.coerce.number().min(0).optional(),
  valorTotalConvenio: z.coerce.number().min(0).optional(),
  convenio: z.string().optional(),
  indicacao: z.string().optional(),
  recurso: z.nativeEnum(ObraRecursoTipo).default(ObraRecursoTipo.PROPRIO),
  possuiContrapartida: z.boolean().optional(),
  valorContrapartida: z.coerce.number().min(0).optional(),
  responsavelId: z.string().uuid().optional(),
  dotacoes: z.array(ObraDotacaoInputSchema).optional(),
});

export const UpdateObraInputSchema = CreateObraInputSchema.partial();

export const CreateObraOutputSchema = z.object({
  obra: ObraSchema,
});

export const GetObraOutputSchema = z.object({
  obra: ObraSchema,
});

export const UpdateObraOutputSchema = z.object({
  obra: ObraSchema,
});

export const DeleteObraOutputSchema = z.object({
  obra: ObraSchema,
});

export const ListObrasOutputSchema = z.object({
  obras: z.array(ObraSchema),
});

export type Obra = z.infer<typeof ObraSchema>;
export type ObraDotacao = z.infer<typeof ObraDotacaoSchema>;
export type ObraDotacaoInput = z.infer<typeof ObraDotacaoInputSchema>;
export type CreateObraInput = z.infer<typeof CreateObraInputSchema>;
export type UpdateObraInput = z.infer<typeof UpdateObraInputSchema>;
export type CreateObraOutput = z.infer<typeof CreateObraOutputSchema>;
export type GetObraOutput = z.infer<typeof GetObraOutputSchema>;
export type UpdateObraOutput = z.infer<typeof UpdateObraOutputSchema>;
export type DeleteObraOutput = z.infer<typeof DeleteObraOutputSchema>;
export type ListObrasOutput = z.infer<typeof ListObrasOutputSchema>;
