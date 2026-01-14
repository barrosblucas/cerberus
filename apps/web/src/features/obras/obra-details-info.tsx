import type { Obra, ObraEnderecoTipo, ObraTipo } from "@repo/contracts";
import { ObraBdiTipo } from "@repo/contracts";
import {
  formatCurrency,
  formatPercent,
  formatText,
  recursoLabels,
} from "./obra-details-formatters";

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

export function ObraDetailsInfo({ obra }: { obra: Obra }) {
  const tipoLabels: Record<ObraTipo, string> = {
    CONSTRUCAO: "Construção",
    REFORMA: "Reforma",
    INSTALACAO: "Instalação",
    ELETRICA: "Elétrica",
    HIDRAULICA: "Hidráulica",
    INFRAESTRUTURA: "Infraestrutura",
    CIVIL: "Civil",
    OUTRO: "Outro",
  };

  const enderecoLabels: Record<ObraEnderecoTipo, string> = {
    URBANO: "Urbano",
    RURAL: "Rural",
  };

  const bdiTipoLabels: Record<ObraBdiTipo, string> = {
    UNICO: "BDI Único",
    DIFERENCIADO: "BDI Diferenciado",
  };

  const avancoFinanceiro = Math.min(Math.max(obra.avancoFinanceiroPercent ?? 0, 0), 100);
  const avancoFisico = Math.min(Math.max(obra.avancoFisicoPercent ?? 0, 0), 100);
  const dotacoes = obra.dotacoes ?? [];

  const bdiItems =
    obra.bdiTipo === ObraBdiTipo.DIFERENCIADO
      ? [
          { label: "Material", value: formatPercent(obra.bdiMaterialPercent) },
          { label: "Equipamento", value: formatPercent(obra.bdiEquipamentoPercent) },
          { label: "Mão-de-Obra", value: formatPercent(obra.bdiMaoDeObraPercent) },
          { label: "Serviço", value: formatPercent(obra.bdiServicoPercent) },
          { label: "Taxa", value: formatPercent(obra.bdiTaxaPercent) },
        ]
      : [{ label: "BDI Único", value: formatPercent(obra.bdiUnicoPercent) }];

  return (
    <div className="card-premium space-y-8">
      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identificação</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem label="Título" value={formatText(obra.titulo)} />
          <DetailItem label="Tipo" value={tipoLabels[obra.tipo]} />
          <DetailItem label="Responsável" value={formatText(obra.responsavelNome)} />
          <DetailItem
            label="Construído (m²)"
            value={obra.construidoM2 != null ? `${obra.construidoM2}` : "—"}
          />
          <DetailItem label="Descrição" value={formatText(obra.descricao)} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Endereço</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem
            label="Tipo"
            value={obra.enderecoTipo ? enderecoLabels[obra.enderecoTipo] : "—"}
          />
          <DetailItem label="Logradouro" value={formatText(obra.enderecoLogradouro)} />
          <DetailItem label="Número" value={formatText(obra.enderecoNumero)} />
          <DetailItem label="Bairro" value={formatText(obra.enderecoBairro)} />
          <DetailItem label="CEP" value={formatText(obra.enderecoCep)} />
          <DetailItem label="Localização" value={obra.localizacao} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">BDI</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem
            label="Tipo de BDI"
            value={obra.bdiTipo ? bdiTipoLabels[obra.bdiTipo] : "—"}
          />
          {bdiItems.map((item) => (
            <DetailItem key={item.label} label={item.label} value={item.value} />
          ))}
          <DetailItem label="Desconto" value={formatPercent(obra.bdiDescontoPercent)} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Financeiro</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem label="Valor total da obra" value={formatCurrency(obra.valorTotalObra)} />
          <DetailItem
            label="Valor total do convênio"
            value={formatCurrency(obra.valorTotalConvenio)}
          />
          <DetailItem label="Convênio" value={formatText(obra.convenio)} />
          <DetailItem label="Indicação" value={formatText(obra.indicacao)} />
          <DetailItem label="Recurso" value={obra.recurso ? recursoLabels[obra.recurso] : "—"} />
          <DetailItem label="Contrapartida" value={obra.possuiContrapartida ? "Sim" : "Não"} />
          <DetailItem
            label="Valor da contrapartida"
            value={formatCurrency(obra.valorContrapartida)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Andamento</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <DetailItem
              label="Avanço financeiro"
              value={formatPercent(obra.avancoFinanceiroPercent)}
            />
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${avancoFinanceiro}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <DetailItem label="Avanço físico" value={formatPercent(obra.avancoFisicoPercent)} />
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-primary-600" style={{ width: `${avancoFisico}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Dotação Orçamentária
        </p>
        {dotacoes.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma dotação informada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dotacoes.map((dotacao) => (
              <div key={dotacao.id} className="rounded-2xl border border-slate-100 p-4">
                <DetailItem label="Projeto/Atividade" value={dotacao.projetoAtividade} />
                <DetailItem label="Código Reduzido" value={dotacao.codigoReduzido} />
                <DetailItem label="Natureza da Despesa" value={dotacao.naturezaDespesa} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
