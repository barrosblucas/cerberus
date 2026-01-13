import { useEffect, useState } from "react";
import { getComposicao } from "../../shared/api-client";

interface CompositionModalProps {
  id: string; // This is the Insumo ID
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t">
          <h3 className="text-lg font-bold">Detalhes da Composição</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : !data || !data.header ? (
            <div className="text-red-500 text-center">Detalhes não encontrados.</div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-blue-50 p-4 rounded border border-blue-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-blue-800 font-bold uppercase">Código</label>
                    <div className="font-mono">{data.header.codigo}</div>
                  </div>
                  <div>
                    <label className="text-xs text-blue-800 font-bold uppercase">
                      Preço Unitário
                    </label>
                    <div className="font-bold text-lg">R$ {data.header.preco?.toFixed(2)}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-blue-800 font-bold uppercase">Descrição</label>
                    <div>{data.header.descricao}</div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold mb-2">Itens da Composição</h4>
                {!data.details?.itens?.length ? (
                  <p className="text-gray-500 italic">
                    Esta composição não possui itens cadastrados ou sincronizados.
                  </p>
                ) : (
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Código</th>
                        <th className="px-3 py-2 text-left">Descrição</th>
                        <th className="px-3 py-2 text-center">Und</th>
                        <th className="px-3 py-2 text-right">Coeficiente</th>
                        <th className="px-3 py-2 text-right">Custo Unit.</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.details.itens.map((item: any) => {
                        const total = item.quantidade * (item.insumo?.preco || 0);
                        return (
                          <tr key={item.id} className="border-b">
                            <td className="px-3 py-2 font-mono text-xs">
                              {item.insumo?.codigo || "-"}
                            </td>
                            <td className="px-3 py-2">
                              {item.insumo?.descricao || "Item sem descrição"}
                            </td>
                            <td className="px-3 py-2 text-center">{item.insumo?.unidade}</td>
                            <td className="px-3 py-2 text-right">{item.quantidade}</td>
                            <td className="px-3 py-2 text-right">
                              {item.insumo?.preco?.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right font-bold">{total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
