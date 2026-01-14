import type { Obra } from "@repo/contracts";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  HardHat,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../shared/utils";
import { useDeleteObra, useObras } from "./use-obras";

export function ObraListPage() {
  const { data: obras, isLoading, isError } = useObras();
  const deleteMutation = useDeleteObra();
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState<string | null>(null);

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
      case "EM_ANDAMENTO":
        return {
          icon: Clock,
          class: "bg-blue-50 text-blue-700 border-blue-100",
          label: "Em Andamento",
        };
      default:
        return {
          icon: Clock,
          class: "bg-slate-50 text-slate-700 border-slate-100",
          label: status,
        };
    }
  };

  if (isLoading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-xl w-48" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );

  if (isError)
    return (
      <div className="card-premium border-red-100 bg-red-50 flex flex-col items-center py-12">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-red-900">Erro ao carregar obras</h3>
        <p className="text-red-600">Ocorreu um problema ao buscar os dados do servidor.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 btn-secondary border-red-200 text-red-700"
        >
          Tentar Novamente
        </button>
      </div>
    );

  const toggleActions = (obraId: string) => {
    setOpenActionId((prev) => (prev === obraId ? null : obraId));
  };

  const handleDelete = async (obraId: string) => {
    const confirmed = window.confirm("Deseja apagar esta obra?");
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync(obraId);
    } finally {
      setOpenActionId(null);
    }
  };

  const obrasList = obras as Obra[] | undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Obras Municipais</h2>
          <p className="text-slate-500 font-medium">
            Gerencie e monitore o progresso das construções públicas.
          </p>
        </div>
        <Link to="/obras/new" className="btn-primary">
          <Plus size={20} />
          <span>Nova Obra</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou localização..."
            className="input-field pl-12"
          />
        </div>
        <button type="button" className="btn-secondary">
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nome da Obra
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Localização
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cronograma
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {obrasList?.map((obra) => {
                const status = getStatusConfig(obra.status);
                const Icon = status.icon;
                return (
                  <tr key={obra.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <Link to={`/obras/${obra.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold shrink-0">
                          {obra.nome?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                          {obra.nome}
                        </span>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                        <MapPin size={16} className="text-slate-400" />
                        {obra.localizacao}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                          status.class,
                        )}
                      >
                        <Icon size={14} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Clock size={14} className="text-slate-400" />
                          <span>Início: {new Date(obra.dataInicio).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Calendar size={14} />
                          <span>
                            Previsão: {new Date(obra.dataPrevisaoTermino).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative flex justify-end gap-2">
                        <Link
                          to={`/obras/${obra.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <ArrowRight size={20} />
                        </Link>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleActions(obra.id);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {openActionId === obra.id && (
                          <div className="absolute right-0 top-12 w-40 rounded-xl border border-slate-100 bg-white shadow-lg p-2 z-10">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenActionId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/obras/${obra.id}/editar`);
                                setOpenActionId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleDelete(obra.id);
                              }}
                              className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              Apagar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {obrasList?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <HardHat size={40} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Nenhuma obra encontrada</h3>
                      <p className="text-slate-500 max-w-xs mx-auto">
                        Comece cadastrando uma nova obra para gerenciar o progresso.
                      </p>
                      <Link to="/obras/new" className="mt-6 btn-primary">
                        <Plus size={20} />
                        Nova Obra
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">
            Mostrando {obrasList?.length || 0} obras
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded border border-slate-200 text-xs font-bold text-slate-400 bg-white cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
