import { ObraStatus } from "@repo/contracts";
import { Building2, Calendar, ChevronLeft, Clock, FileText, MapPin, Save } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      });
      navigate("/obras");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link to="/obras" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-slate-400" />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nova Obra</h2>
          <p className="text-slate-500 font-medium">
            Preencha as informações para iniciar um novo projeto.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-premium space-y-8 p-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="nome"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Building2 size={16} className="text-slate-400" />
              Nome da Obra
            </label>
            <input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Reforma da Unidade de Saúde Central"
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="descricao"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <FileText size={16} className="text-slate-400" />
              Breve Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva os objetivos principais deste projeto..."
              className="input-field min-h-[120px] py-3"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="localizacao"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <MapPin size={16} className="text-slate-400" />
              Localização / Endereço
            </label>
            <input
              id="localizacao"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              placeholder="Bairro, Rua ou Coordenadas..."
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <Clock size={16} className="text-slate-400" />
                Status Inicial
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                {Object.values(ObraStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="dataInicio"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <Calendar size={16} className="text-slate-400" />
                Data de Início
              </label>
              <input
                id="dataInicio"
                type="date"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dataPrevisaoTermino"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <Calendar size={16} className="text-slate-400" />
                Previsão de Término
              </label>
              <input
                id="dataPrevisaoTermino"
                type="date"
                name="dataPrevisaoTermino"
                value={formData.dataPrevisaoTermino}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
          <Link to="/obras" className="btn-secondary">
            Cancelar
          </Link>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary px-10">
            {createMutation.isPending ? (
              <Clock className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            <span>{createMutation.isPending ? "Salvando..." : "Salvar Obra"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
