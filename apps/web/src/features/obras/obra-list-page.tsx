import { Link } from "react-router-dom";
import { useObras } from "./use-obras";

export function ObraListPage() {
  const { data: obras, isLoading, isError } = useObras();

  if (isLoading) return <div>Carregando obras...</div>;
  if (isError) return <div className="text-red-600">Erro ao carregar obras.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Obras</h2>
        <Link
          to="/obras/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Obra
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Nome</th>
              <th className="py-2 px-4 text-left">Localização</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Início</th>
              <th className="py-2 px-4 text-left">Previsão</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {obras?.map((obra: any) => (
              <tr key={obra.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{obra.nome}</td>
                <td className="py-2 px-4">{obra.localizacao}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      obra.status === "CONCLUIDA"
                        ? "bg-green-100 text-green-800"
                        : obra.status === "PARALISADA"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {obra.status}
                  </span>
                </td>
                <td className="py-2 px-4">{new Date(obra.dataInicio).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  {new Date(obra.dataPrevisaoTermino).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <Link to={`/obras/${obra.id}`} className="text-blue-600 hover:underline">
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {obras?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Nenhuma obra cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
