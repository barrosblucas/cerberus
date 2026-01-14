import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  DollarSign,
  Edit3,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getObra, listOrcamentosByObra } from "../../shared/api-client";
import { cn } from "../../shared/utils";

export function ObraDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [obra, setObra] = useState<any>(null);
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getObra(id), listOrcamentosByObra(id)])
      .then(([obraData, orcamentosData]) => {
        setObra(obraData);
        setOrcamentos(orcamentosData.orcamentos);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );

  if (!obra)
    return (
      <div className="card-premium text-center py-20">
        <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800">Obra não encontrada</h3>
        <Link to="/obras" className="mt-4 btn-secondary">
          Voltar para a lista
        </Link>
      </div>
    );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return {
          icon: CheckCircle2,
          class: "bg-emerald-50 text-emerald-700 border-emerald-100",
          label: "Concluída",
        };
      case "PARALISADA":
        return {
          icon: AlertCircle,
          class: "bg-red-50 text-red-700 border-red-100",
          label: "Paralisada",
        };
      default:
        return {
          icon: Clock,
          class: "bg-blue-50 text-blue-700 border-blue-100",
          label: status || "Em Andamento",
        };
    }
  };

  const status = getStatusConfig(obra.status);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-8">
      {/* Header Navigator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <Link to="/obras" className="p-2 hover:bg-slate-100 rounded-xl transition-colors mt-1">
            <ChevronLeft size={24} className="text-slate-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                  status.class,
                )}
              >
                <StatusIcon size={14} />
                {status.label}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                ID: {obra.id.split("-")[0]}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{obra.nome}</h2>
            <div className="flex items-center gap-2 text-slate-500 font-medium mt-1">
              <MapPin size={18} className="text-slate-400" />
              <span>{obra.localizacao}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="btn-secondary">
            <Edit3 size={18} />
            <span>Editar Projeto</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/orcamentos?obraId=${obra.id}`)}
            className="btn-primary"
          >
            <Plus size={18} />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Calendar size={16} />
            <span>Início da Obra</span>
          </div>
          <p className="text-xl font-black text-slate-800">
            {new Date(obra.dataInicio).toLocaleDateString()}
          </p>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Clock size={16} />
            <span>Previsão de Entrega</span>
          </div>
          <p className="text-xl font-black text-slate-800">
            {new Date(obra.dataPrevisaoTermino).toLocaleDateString()}
          </p>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <FileText size={16} />
            <span>Orçamentos Base</span>
          </div>
          <p className="text-xl font-black text-slate-800">{orcamentos.length}</p>
        </div>
        <div className="card-premium bg-primary-600 text-white border-none">
          <div className="flex items-center gap-3 text-primary-100 font-bold text-xs uppercase tracking-widest mb-4">
            <DollarSign size={16} />
            <span>Investimento Total</span>
          </div>
          <p className="text-xl font-black">
            R${" "}
            {orcamentos
              .reduce((acc, o) => acc + (o.total || 0), 0)
              .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Budgets Section */}
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
                      R${" "}
                      {orc.total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
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
    </div>
  );
}
