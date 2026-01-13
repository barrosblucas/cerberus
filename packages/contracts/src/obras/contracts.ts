import { z } from "zod";

export enum ObraStatus {
  PLANEJAMENTO = "PLANEJAMENTO",
  LICITACAO = "LICITACAO",
  EXECUCAO = "EXECUCAO",
  PARALISADA = "PARALISADA",
  CONCLUIDA = "CONCLUIDA",
}

export const ObraSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().nullable().optional(),
  localizacao: z.string().min(1),
  status: z.nativeEnum(ObraStatus),
  dataInicio: z.coerce.date(),
  dataPrevisaoTermino: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  responsavelId: z.string().uuid().nullable().optional(),
});

export const CreateObraInputSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  status: z.nativeEnum(ObraStatus).default(ObraStatus.PLANEJAMENTO),
  dataInicio: z.coerce.date({ required_error: "Data de início é obrigatória" }),
  dataPrevisaoTermino: z.coerce.date({ required_error: "Previsão de término é obrigatória" }),
  responsavelId: z.string().uuid().optional(),
});

export const UpdateObraInputSchema = CreateObraInputSchema.partial();

export const CreateObraOutputSchema = z.object({
  obra: ObraSchema,
});

export const ListObrasOutputSchema = z.object({
  obras: z.array(ObraSchema),
});

export type Obra = z.infer<typeof ObraSchema>;
export type CreateObraInput = z.infer<typeof CreateObraInputSchema>;
export type UpdateObraInput = z.infer<typeof UpdateObraInputSchema>;
export type CreateObraOutput = z.infer<typeof CreateObraOutputSchema>;
export type ListObrasOutput = z.infer<typeof ListObrasOutputSchema>;
