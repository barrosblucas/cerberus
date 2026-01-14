import { AlertCircle, Calculator, DollarSign, Info, Layers, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getComposicao } from "../../shared/api-client";
import { cn } from "../../shared/utils";

interface CompositionModalProps {
  id: string;
  onClose: () => void;
}

export function CompositionModal({ id, onClose }: CompositionModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComposicao(id)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Detalhes da Composição
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Análise de Custo Unitário (CPU)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-slate-500 font-bold animate-pulse">Analizando composição...</p>
            </div>
          ) : !data || !data.header ? (
            <div className="text-center py-20 space-y-4">
              <AlertCircle size={48} className="mx-auto text-red-300" />
              <h3 className="text-xl font-bold text-slate-800">Dados não encontrados</h3>
              <p className="text-slate-500">
                Infelizmente não conseguimos recuperar os detalhes desta composição.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Premium Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-premium bg-slate-50 border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Referência SINAPI
                  </span>
                  <div className="font-mono font-black text-slate-800 text-lg tracking-tighter">
                    {data.header.codigo}
                  </div>
                </div>
                <div className="card-premium bg-emerald-50 border-emerald-100">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">
                    Custo Unitário
                  </span>
                  <div className="font-black text-emerald-700 text-lg flex items-center gap-1">
                    <DollarSign size={18} />
                    {data.header.preco?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="card-premium bg-primary-50 border-primary-100">
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest block mb-2">
                    Unidade
                  </span>
                  <div className="font-black text-primary-700 text-lg uppercase">
                    {data.header.unidade || "UN"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Descrição Completa
                </span>
                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                  "{data.header.descricao}"
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-slate-400" />
                  <h4 className="font-black text-slate-800 tracking-tight">
                    Insumos e Mão de Obra
                  </h4>
                </div>

                {!data.details?.itens?.length ? (
                  <div className="bg-slate-50 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                      Sem itens detalhados nesta composição
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Descrição do Insumo
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Und
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Quant.
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Custo
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium whitespace-nowrap lg:whitespace-normal">
                        {data.details.itens.map((item: { id: string; quantidade: number; insumo?: { codigo?: string; descricao?: string; unidade?: string; preco?: number } }) => {
                          const total = item.quantidade * (item.insumo?.preco || 0);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-mono text-[10px] text-slate-500 font-bold">
                                {item.insumo?.codigo || "-"}
                              </td>
                              <td className="px-4 py-3 text-slate-700 text-xs font-semibold">
                                {item.insumo?.descricao || "Item sem descrição"}
                              </td>
                              <td className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase">
                                {item.insumo?.unidade}
                              </td>
                              <td className="px-4 py-3 text-right font-black text-slate-600">
                                {item.quantidade}
                              </td>
                              <td className="px-4 py-3 text-right text-slate-500">
                                {item.insumo?.preco?.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 text-right font-black text-slate-900">
                                {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-12 px-8"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
