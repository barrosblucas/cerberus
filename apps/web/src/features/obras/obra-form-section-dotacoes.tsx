import { Landmark, Plus, Trash2 } from "lucide-react";
import type { DotacaoField, DotacaoInput } from "./obra-form-data";

type DotacoesSectionProps = {
  dotacoes: DotacaoInput[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: DotacaoField, value: string) => void;
};

export function ObraDotacoesSection({ dotacoes, onAdd, onRemove, onChange }: DotacoesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Landmark size={16} />
          <span>Dotação Orçamentária</span>
        </div>
        <button type="button" onClick={onAdd} className="btn-secondary">
          <Plus size={16} />
          <span>Adicionar</span>
        </button>
      </div>

      <div className="space-y-4">
        {dotacoes.map((dotacao, index) => {
          const baseId = `dotacao-${dotacao.id}`;
          return (
            <div key={dotacao.id} className="rounded-2xl border border-slate-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-600">Dotação {index + 1}</p>
                {dotacoes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor={`${baseId}-projeto`}
                    className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  >
                    Projeto/Atividade
                  </label>
                  <input
                    id={`${baseId}-projeto`}
                    value={dotacao.projetoAtividade}
                    onChange={(event) => onChange(index, "projetoAtividade", event.target.value)}
                    placeholder="Projeto 01"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`${baseId}-codigo`}
                    className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  >
                    Código Reduzido
                  </label>
                  <input
                    id={`${baseId}-codigo`}
                    value={dotacao.codigoReduzido}
                    onChange={(event) => onChange(index, "codigoReduzido", event.target.value)}
                    placeholder="1234"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`${baseId}-natureza`}
                    className="text-xs font-bold text-slate-500 uppercase tracking-wide"
                  >
                    Natureza da Despesa
                  </label>
                  <input
                    id={`${baseId}-natureza`}
                    value={dotacao.naturezaDespesa}
                    onChange={(event) => onChange(index, "naturezaDespesa", event.target.value)}
                    placeholder="Investimentos"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
