import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getObra, listOrcamentosByObra } from "../../shared/api-client";

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
        alert("Erro ao carregar dados");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!obra) return <div className="p-8">Obra não encontrada.</div>;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{obra.nome}</h2>
          <p className="text-gray-500">{obra.localizacao}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            {obra.status}
          </span>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded">Editar</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-sm text-gray-500">Data Início</div>
          <div className="font-medium">{formatDate(obra.dataInicio)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Previsão Término</div>
          <div className="font-medium">{formatDate(obra.dataPrevisaoTermino)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Orçamentos</div>
          <div className="font-medium text-blue-600">{orcamentos.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Orçamentos</h3>
          <button
            onClick={() => navigate(`/orcamentos?obraId=${obra.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Novo Orçamento
          </button>
        </div>

        <div className="bg-white border rounded overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Data Base
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orcamentos.map((orc) => (
                <tr key={orc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {orc.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {orc.dataBaseMonth}/{orc.dataBaseYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                    R$ {orc.total?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5500"}/v1/reports/orcamento/${orc.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                      title="Baixar PDF"
                    >
                      📄 PDF
                    </a>
                    <Link
                      to={`/orcamentos?id=${orc.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {orcamentos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum orçamento criado para esta obra.
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
