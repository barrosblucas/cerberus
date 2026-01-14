import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  DollarSign,
  Edit3,
  MapPin,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../shared/utils";
import { useOrcamentosByObra } from "../orcamentos/use-orcamentos";
import { ObraBudgetsSection } from "./obra-details-budgets";
import { formatDate } from "./obra-details-formatters";
import { ObraDetailsInfo } from "./obra-details-info";
import type { OrcamentoResumo } from "./obra-details-types";
import { useObra } from "./use-obras";

export function ObraDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const obraQuery = useObra(id ?? "");
  const orcamentosQuery = useOrcamentosByObra(id ?? "");
  const obra = obraQuery.data ?? null;
  const orcamentos = (orcamentosQuery.data?.orcamentos ?? []) as OrcamentoResumo[];
  const loading = obraQuery.isLoading || orcamentosQuery.isLoading;
  const isError = obraQuery.isError || orcamentosQuery.isError;

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

  if (isError)
    return (
      <div className="card-premium border-red-100 bg-red-50 flex flex-col items-center py-12">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-red-900">Erro ao carregar detalhes</h3>
        <p className="text-red-600">Não foi possível carregar as informações da obra.</p>
        <button
          type="button"
          onClick={() => {
            void obraQuery.refetch();
            void orcamentosQuery.refetch();
          }}
          className="mt-6 btn-secondary border-red-200 text-red-700"
        >
          Tentar Novamente
        </button>
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
  const avancoFinanceiro = Math.min(Math.max(obra.avancoFinanceiroPercent ?? 0, 0), 100);
  const avancoFisico = Math.min(Math.max(obra.avancoFisicoPercent ?? 0, 0), 100);

  return (
    <div className="space-y-8">
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
          <button
            type="button"
            onClick={() => navigate(`/obras/${obra.id}/editar`)}
            className="btn-secondary"
          >
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Calendar size={16} />
            <span>Início da Obra</span>
          </div>
          <p className="text-xl font-black text-slate-800">{formatDate(obra.dataInicio)}</p>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Clock size={16} />
            <span>Previsão de Entrega</span>
          </div>
          <p className="text-xl font-black text-slate-800">
            {formatDate(obra.dataPrevisaoTermino)}
          </p>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <DollarSign size={16} />
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
              .reduce((acc, orc) => acc + (orc.total || 0), 0)
              .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <TrendingUp size={16} />
            <span>Avanço Financeiro</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{avancoFinanceiro.toFixed(1)}%</p>
          <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${avancoFinanceiro}%` }}
            />
          </div>
        </div>
        <div className="card-premium">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <TrendingUp size={16} />
            <span>Avanço Físico</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{avancoFisico.toFixed(1)}%</p>
          <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${avancoFisico}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Detalhamento da Obra
          </h3>
          <div className="h-px flex-1 bg-slate-100 mx-8 hidden lg:block" />
        </div>
        <ObraDetailsInfo obra={obra} />
      </div>

      <ObraBudgetsSection orcamentos={orcamentos} />
    </div>
  );
}
