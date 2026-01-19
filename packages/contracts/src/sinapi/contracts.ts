import { z } from "zod";

export const SinapiItemTypeSchema = z.enum(["INSUMO", "COMPOSICAO"]);
export type SinapiItemType = z.infer<typeof SinapiItemTypeSchema>;

export const SinapiScenarioSchema = z.enum(["nao_desonerado", "desonerado", "sem_encargos"]);
export type SinapiScenario = z.infer<typeof SinapiScenarioSchema>;

export const SinapiFiltersSchema = z.object({
    q: z.string().optional(),
    uf: z.string().length(2).default("MS"),
    cenario: SinapiScenarioSchema.default("nao_desonerado"),
    referencia: z.string().optional(), // YYYY-MM
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});
export type SinapiFilters = z.infer<typeof SinapiFiltersSchema>;

export const SinapiItemListItemSchema = z.object({
    codigo: z.string(),
    descricao: z.string(),
    unidade: z.string(),
    tipo: SinapiItemTypeSchema,
    preco: z.number().nullable(),
});
export type SinapiItemListItem = z.infer<typeof SinapiItemListItemSchema>;

export const SinapiListOutputSchema = z.object({
    items: z.array(SinapiItemListItemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});
export type SinapiListOutput = z.infer<typeof SinapiListOutputSchema>;

export const SinapiItemChildSchema = z.object({
    tipo: z.string(),
    codigo: z.string().nullable(),
    descricao: z.string(),
    unidade: z.string(),
    coeficiente: z.coerce.number(),
    precoUnitario: z.number().optional().nullable(),
    precoTotal: z.number().optional().nullable(),
});

export const SinapiItemDetailsSchema = z.object({
    codigo: z.string(),
    descricao: z.string(),
    unidade: z.string(),
    tipo: SinapiItemTypeSchema,
    preco: z.number().nullable(),
    referencia: z.string(),
    uf: z.string(),
    cenario: SinapiScenarioSchema,
    itens: z.array(SinapiItemChildSchema).optional(),
});
export type SinapiItemDetails = z.infer<typeof SinapiItemDetailsSchema>;

export const AddSinapiItemInputSchema = z.object({
    codigo: z.string(),
    referencia: z.string(),
    etapaId: z.string().uuid(),
    quantidade: z.number().min(0.0001),
});
export type AddSinapiItemInput = z.infer<typeof AddSinapiItemInputSchema>;
