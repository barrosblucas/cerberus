import { ObraStatus } from "@repo/contracts";
import { Building2, Calendar, Clock, FileText, MapPin, Tag, User } from "lucide-react";
import type { ObraFormData } from "./obra-form-data";
import { enderecoTipoOptions, obraTipoOptions } from "./obra-form-data";

type FormChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => void;

type SectionProps = {
  formData: ObraFormData;
  onChange: FormChangeHandler;
};

export function ObraInfoSection({ formData, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Building2 size={16} />
        <span>Informações da Obra</span>
      </div>

      <div className="space-y-2">
        <label htmlFor="nome" className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Building2 size={16} className="text-slate-400" />
          Nome da Obra
        </label>
        <input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={onChange}
          placeholder="Ex: Reforma da Unidade de Saúde Central"
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="titulo"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Tag size={16} className="text-slate-400" />
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={onChange}
            placeholder="Ex: Lote 1 - Bloco A"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="tipo"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Building2 size={16} className="text-slate-400" />
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={onChange}
            className="input-field"
            required
          >
            {obraTipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
          onChange={onChange}
          placeholder="Descreva os objetivos principais deste projeto..."
          className="input-field min-h-[120px] py-3"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="responsavelNome"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <User size={16} className="text-slate-400" />
            Responsável
          </label>
          <input
            id="responsavelNome"
            name="responsavelNome"
            value={formData.responsavelNome}
            onChange={onChange}
            placeholder="Ex: Eng. João Silva"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="construidoM2"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Building2 size={16} className="text-slate-400" />
            Construído (m²)
          </label>
          <input
            id="construidoM2"
            name="construidoM2"
            type="number"
            min="0"
            step="0.01"
            value={formData.construidoM2}
            onChange={onChange}
            placeholder="0"
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}

export function ObraEnderecoSection({ formData, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <MapPin size={16} />
        <span>Endereço</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="enderecoTipo"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <MapPin size={16} className="text-slate-400" />
            Tipo
          </label>
          <select
            id="enderecoTipo"
            name="enderecoTipo"
            value={formData.enderecoTipo}
            onChange={onChange}
            className="input-field"
            required
          >
            {enderecoTipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="enderecoCep"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <MapPin size={16} className="text-slate-400" />
            CEP
          </label>
          <input
            id="enderecoCep"
            name="enderecoCep"
            value={formData.enderecoCep}
            onChange={onChange}
            placeholder="00000-000"
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="enderecoLogradouro"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <MapPin size={16} className="text-slate-400" />
            Logradouro
          </label>
          <input
            id="enderecoLogradouro"
            name="enderecoLogradouro"
            value={formData.enderecoLogradouro}
            onChange={onChange}
            placeholder="Rua, Avenida, Travessa..."
            className="input-field"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="enderecoNumero"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <MapPin size={16} className="text-slate-400" />
            Número
          </label>
          <input
            id="enderecoNumero"
            name="enderecoNumero"
            value={formData.enderecoNumero}
            onChange={onChange}
            placeholder="100"
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="enderecoBairro"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <MapPin size={16} className="text-slate-400" />
            Bairro
          </label>
          <input
            id="enderecoBairro"
            name="enderecoBairro"
            value={formData.enderecoBairro}
            onChange={onChange}
            placeholder="Centro"
            className="input-field"
            required
          />
        </div>
      </div>
    </div>
  );
}

export function ObraCronogramaSection({ formData, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Calendar size={16} />
        <span>Cronograma</span>
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
            onChange={onChange}
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
            onChange={onChange}
            className="input-field"
            required
          />
        </div>
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
            onChange={onChange}
            className="input-field"
          >
            {Object.values(ObraStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
