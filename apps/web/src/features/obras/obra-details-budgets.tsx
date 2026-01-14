import { Edit3, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrcamentoResumo } from "./obra-details-types";

type ObraBudgetsSectionProps = {
  orcamentos: OrcamentoResumo[];
};

export function ObraBudgetsSection({ orcamentos }: ObraBudgetsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Planilha de Orçamentos
        </h3>
        <div className="h-px flex-1 bg-slate-100 mx-8 hidden lg:block" />
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Título do Orçamento
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Data Base
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Valor Estimado
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orcamentos.map((orc) => (
                <tr key={orc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{orc.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {orc.dataBaseMonth}/{orc.dataBaseYear}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900">
                    R$ {orc.total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5500"}/v1/reports/orcamento/${orc.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Gerar PDF"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <Link
                        to={`/orcamentos?id=${orc.id}`}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {orcamentos.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <FileText size={48} className="mb-4" />
                      <h3 className="text-lg font-bold text-slate-800">
                        Nenhum orçamento vinculado
                      </h3>
                      <p className="text-slate-500">
                        Crie planilhas de custo para esta obra usando o banco de preços.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
