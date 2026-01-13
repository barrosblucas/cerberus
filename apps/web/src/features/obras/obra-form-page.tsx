import { ObraStatus } from "@repo/contracts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateObra } from "./use-obras";

export function ObraFormPage() {
  const navigate = useNavigate();
  const createMutation = useCreateObra();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    localizacao: "",
    status: ObraStatus.PLANEJAMENTO,
    dataInicio: "",
    dataPrevisaoTermino: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        // Conversão de datas se necessário, mas o input date manda string YYYY-MM-DD que o Zod coerce date aceita.
      });
      navigate("/obras");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar obra");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Nova Obra</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Localização</label>
          <input
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded border p-2"
            >
              {Object.values(ObraStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Início</label>
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Previsão Término</label>
            <input
              type="date"
              name="dataPrevisaoTermino"
              value={formData.dataPrevisaoTermino}
              onChange={handleChange}
              className="mt-1 block w-full rounded border p-2"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/obras")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {createMutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
