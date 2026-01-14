import type { ObraRecursoTipo } from "@repo/contracts";

export const recursoLabels: Record<ObraRecursoTipo, string> = {
  PROPRIO: "Próprio",
  MISTO: "Misto",
  FEDERAL: "Federal",
  ESTADUAL: "Estadual",
};

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });

export const formatCurrency = (value?: number | null) =>
  value == null
    ? "—"
    : `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatPercent = (value?: number | null) =>
  value == null ? "—" : `${value.toFixed(1)}%`;

export const formatText = (value?: string | null) => (value?.trim() ? value : "—");
