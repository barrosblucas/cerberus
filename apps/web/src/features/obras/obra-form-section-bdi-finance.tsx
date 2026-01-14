import { Percent, Wallet } from "lucide-react";
import type { ObraFormData } from "./obra-form-data";
import { bdiTipoOptions, recursoOptions } from "./obra-form-data";

type FormChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => void;

type BdiSectionProps = {
  formData: ObraFormData;
  onChange: FormChangeHandler;
  isBdiUnico: boolean;
};

type FinanceiroSectionProps = {
  formData: ObraFormData;
  onChange: FormChangeHandler;
  hasContrapartida: boolean;
};

export function ObraBdiSection({ formData, onChange, isBdiUnico }: BdiSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Percent size={16} />
        <span>Informações para cálculo de BDI</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="bdiTipo"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Percent size={16} className="text-slate-400" />
            Tipo de BDI
          </label>
          <select
            id="bdiTipo"
            name="bdiTipo"
            value={formData.bdiTipo}
            onChange={onChange}
            className="input-field"
          >
            {bdiTipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="bdiDescontoPercent"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Percent size={16} className="text-slate-400" />
            Desconto (%)
          </label>
          <input
            id="bdiDescontoPercent"
            name="bdiDescontoPercent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.bdiDescontoPercent}
            onChange={onChange}
            placeholder="0"
            className="input-field"
          />
        </div>
      </div>

      {isBdiUnico ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="bdiUnicoPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              BDI Único (%)
            </label>
            <input
              id="bdiUnicoPercent"
              name="bdiUnicoPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiUnicoPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="bdiMaterialPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              Material (%)
            </label>
            <input
              id="bdiMaterialPercent"
              name="bdiMaterialPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiMaterialPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bdiEquipamentoPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              Equipamento (%)
            </label>
            <input
              id="bdiEquipamentoPercent"
              name="bdiEquipamentoPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiEquipamentoPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bdiMaoDeObraPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              Mão-de-Obra (%)
            </label>
            <input
              id="bdiMaoDeObraPercent"
              name="bdiMaoDeObraPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiMaoDeObraPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bdiServicoPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              Serviço (%)
            </label>
            <input
              id="bdiServicoPercent"
              name="bdiServicoPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiServicoPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bdiTaxaPercent"
              className="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <Percent size={16} className="text-slate-400" />
              Taxa (%)
            </label>
            <input
              id="bdiTaxaPercent"
              name="bdiTaxaPercent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.bdiTaxaPercent}
              onChange={onChange}
              placeholder="0"
              className="input-field"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ObraFinanceiroSection({
  formData,
  onChange,
  hasContrapartida,
}: FinanceiroSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Wallet size={16} />
        <span>Informações Financeiras e Convênio</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="valorTotalObra"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Valor Total da Obra (R$)
          </label>
          <input
            id="valorTotalObra"
            name="valorTotalObra"
            type="number"
            min="0"
            step="0.01"
            value={formData.valorTotalObra}
            onChange={onChange}
            placeholder="0,00"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="valorTotalConvenio"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Valor Total do Convênio (R$)
          </label>
          <input
            id="valorTotalConvenio"
            name="valorTotalConvenio"
            type="number"
            min="0"
            step="0.01"
            value={formData.valorTotalConvenio}
            onChange={onChange}
            placeholder="0,00"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="convenio"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Convênio
          </label>
          <input
            id="convenio"
            name="convenio"
            value={formData.convenio}
            onChange={onChange}
            placeholder="Ex: Convênio 2026/123"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="indicacao"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Indicação
          </label>
          <input
            id="indicacao"
            name="indicacao"
            value={formData.indicacao}
            onChange={onChange}
            placeholder="Ex: Indicação parlamentar"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="recurso"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Recurso
          </label>
          <select
            id="recurso"
            name="recurso"
            value={formData.recurso}
            onChange={onChange}
            className="input-field"
          >
            {recursoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="possuiContrapartida"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Existe contrapartida?
          </label>
          <select
            id="possuiContrapartida"
            name="possuiContrapartida"
            value={formData.possuiContrapartida}
            onChange={onChange}
            className="input-field"
          >
            <option value="SIM">Sim</option>
            <option value="NAO">Não</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="valorContrapartida"
            className="text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <Wallet size={16} className="text-slate-400" />
            Valor da Contrapartida (R$)
          </label>
          <input
            id="valorContrapartida"
            name="valorContrapartida"
            type="number"
            min="0"
            step="0.01"
            value={formData.valorContrapartida}
            onChange={onChange}
            placeholder="0,00"
            className="input-field"
            disabled={!hasContrapartida}
          />
        </div>
      </div>
    </div>
  );
}
