import { ObraBdiTipo } from "@repo/contracts";
import { Clock, Save } from "lucide-react";
import { Link } from "react-router-dom";
import type { DotacaoField, DotacaoInput, ObraFormData } from "./obra-form-data";
import { ObraBdiSection, ObraFinanceiroSection } from "./obra-form-section-bdi-finance";
import { ObraDotacoesSection } from "./obra-form-section-dotacoes";
import {
  ObraCronogramaSection,
  ObraEnderecoSection,
  ObraInfoSection,
} from "./obra-form-sections-primary";

type FormChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => void;

type ObraFormProps = {
  formData: ObraFormData;
  dotacoes: DotacaoInput[];
  isSubmitting: boolean;
  submitLabel: string;
  onChange: FormChangeHandler;
  onDotacaoChange: (index: number, field: DotacaoField, value: string) => void;
  onAddDotacao: () => void;
  onRemoveDotacao: (index: number) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function ObraForm({
  formData,
  dotacoes,
  isSubmitting,
  submitLabel,
  onChange,
  onDotacaoChange,
  onAddDotacao,
  onRemoveDotacao,
  onSubmit,
}: ObraFormProps) {
  const isBdiUnico = formData.bdiTipo === ObraBdiTipo.UNICO;
  const hasContrapartida = formData.possuiContrapartida === "SIM";

  return (
    <form onSubmit={onSubmit} className="card-premium space-y-10 p-10">
      <ObraInfoSection formData={formData} onChange={onChange} />
      <ObraEnderecoSection formData={formData} onChange={onChange} />
      <ObraCronogramaSection formData={formData} onChange={onChange} />
      <ObraBdiSection formData={formData} onChange={onChange} isBdiUnico={isBdiUnico} />
      <ObraFinanceiroSection
        formData={formData}
        onChange={onChange}
        hasContrapartida={hasContrapartida}
      />
      <ObraDotacoesSection
        dotacoes={dotacoes}
        onAdd={onAddDotacao}
        onRemove={onRemoveDotacao}
        onChange={onDotacaoChange}
      />

      <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
        <Link to="/obras" className="btn-secondary">
          Cancelar
        </Link>
        <button type="submit" disabled={isSubmitting} className="btn-primary px-10">
          {isSubmitting ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
          <span>{isSubmitting ? "Salvando..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
