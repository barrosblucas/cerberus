import type { Obra } from "@repo/contracts";
import {
  ObraBdiTipo,
  ObraEnderecoTipo,
  ObraRecursoTipo,
  ObraStatus,
  ObraTipo,
} from "@repo/contracts";

export type DotacaoInput = {
  id: string;
  projetoAtividade: string;
  codigoReduzido: string;
  naturezaDespesa: string;
};

export type DotacaoField = keyof DotacaoInput;
export type ContrapartidaOption = "SIM" | "NAO";

export type ObraFormData = {
  nome: string;
  titulo: string;
  tipo: ObraTipo;
  descricao: string;
  status: ObraStatus;
  dataInicio: string;
  dataPrevisaoTermino: string;
  construidoM2: string;
  responsavelNome: string;
  enderecoTipo: ObraEnderecoTipo;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCep: string;
  bdiTipo: ObraBdiTipo;
  bdiUnicoPercent: string;
  bdiMaterialPercent: string;
  bdiEquipamentoPercent: string;
  bdiMaoDeObraPercent: string;
  bdiServicoPercent: string;
  bdiTaxaPercent: string;
  bdiDescontoPercent: string;
  valorTotalObra: string;
  valorTotalConvenio: string;
  convenio: string;
  indicacao: string;
  recurso: ObraRecursoTipo;
  possuiContrapartida: ContrapartidaOption;
  valorContrapartida: string;
};

export const createDotacaoInput = (): DotacaoInput => ({
  id: crypto.randomUUID(),
  projetoAtividade: "",
  codigoReduzido: "",
  naturezaDespesa: "",
});

export const defaultObraFormData: ObraFormData = {
  nome: "",
  titulo: "",
  tipo: ObraTipo.CONSTRUCAO,
  descricao: "",
  status: ObraStatus.PLANEJAMENTO,
  dataInicio: "",
  dataPrevisaoTermino: "",
  construidoM2: "",
  responsavelNome: "",
  enderecoTipo: ObraEnderecoTipo.URBANO,
  enderecoLogradouro: "",
  enderecoNumero: "",
  enderecoBairro: "",
  enderecoCep: "",
  bdiTipo: ObraBdiTipo.UNICO,
  bdiUnicoPercent: "",
  bdiMaterialPercent: "",
  bdiEquipamentoPercent: "",
  bdiMaoDeObraPercent: "",
  bdiServicoPercent: "",
  bdiTaxaPercent: "",
  bdiDescontoPercent: "",
  valorTotalObra: "",
  valorTotalConvenio: "",
  convenio: "",
  indicacao: "",
  recurso: ObraRecursoTipo.PROPRIO,
  possuiContrapartida: "NAO",
  valorContrapartida: "",
};

export const obraTipoOptions = [
  { value: ObraTipo.CONSTRUCAO, label: "Construção" },
  { value: ObraTipo.REFORMA, label: "Reforma" },
  { value: ObraTipo.INSTALACAO, label: "Instalação" },
  { value: ObraTipo.ELETRICA, label: "Elétrica" },
  { value: ObraTipo.HIDRAULICA, label: "Hidráulica" },
  { value: ObraTipo.INFRAESTRUTURA, label: "Infraestrutura" },
  { value: ObraTipo.CIVIL, label: "Civil" },
  { value: ObraTipo.OUTRO, label: "Outro" },
];

export const enderecoTipoOptions = [
  { value: ObraEnderecoTipo.URBANO, label: "Urbano" },
  { value: ObraEnderecoTipo.RURAL, label: "Rural" },
];

export const bdiTipoOptions = [
  { value: ObraBdiTipo.UNICO, label: "BDI Único" },
  { value: ObraBdiTipo.DIFERENCIADO, label: "BDI Diferenciado" },
];

export const recursoOptions = [
  { value: ObraRecursoTipo.PROPRIO, label: "Próprio" },
  { value: ObraRecursoTipo.MISTO, label: "Misto" },
  { value: ObraRecursoTipo.FEDERAL, label: "Federal" },
  { value: ObraRecursoTipo.ESTADUAL, label: "Estadual" },
];

export const toOptionalNumber = (value: string) => {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const buildLocalizacao = (logradouro: string, numero: string, bairro: string, cep: string) =>
  `${logradouro}, ${numero} - ${bairro}, CEP ${cep}`;

export const buildObraPayload = (formData: ObraFormData, dotacoes: DotacaoInput[]) => {
  const isBdiUnico = formData.bdiTipo === ObraBdiTipo.UNICO;
  const hasContrapartida = formData.possuiContrapartida === "SIM";
  const dotacoesPayload = dotacoes
    .filter(
      (dotacao) =>
        dotacao.projetoAtividade.trim() &&
        dotacao.codigoReduzido.trim() &&
        dotacao.naturezaDespesa.trim(),
    )
    .map((dotacao) => ({
      projetoAtividade: dotacao.projetoAtividade.trim(),
      codigoReduzido: dotacao.codigoReduzido.trim(),
      naturezaDespesa: dotacao.naturezaDespesa.trim(),
    }));

  return {
    nome: formData.nome,
    titulo: formData.titulo.trim() || undefined,
    tipo: formData.tipo,
    descricao: formData.descricao.trim() || undefined,
    localizacao: buildLocalizacao(
      formData.enderecoLogradouro,
      formData.enderecoNumero,
      formData.enderecoBairro,
      formData.enderecoCep,
    ),
    enderecoTipo: formData.enderecoTipo,
    enderecoLogradouro: formData.enderecoLogradouro,
    enderecoNumero: formData.enderecoNumero,
    enderecoBairro: formData.enderecoBairro,
    enderecoCep: formData.enderecoCep,
    status: formData.status,
    dataInicio: formData.dataInicio,
    dataPrevisaoTermino: formData.dataPrevisaoTermino,
    construidoM2: toOptionalNumber(formData.construidoM2),
    responsavelNome: formData.responsavelNome.trim() || undefined,
    bdiTipo: formData.bdiTipo,
    bdiUnicoPercent: isBdiUnico ? toOptionalNumber(formData.bdiUnicoPercent) : undefined,
    bdiMaterialPercent: !isBdiUnico ? toOptionalNumber(formData.bdiMaterialPercent) : undefined,
    bdiEquipamentoPercent: !isBdiUnico
      ? toOptionalNumber(formData.bdiEquipamentoPercent)
      : undefined,
    bdiMaoDeObraPercent: !isBdiUnico ? toOptionalNumber(formData.bdiMaoDeObraPercent) : undefined,
    bdiServicoPercent: !isBdiUnico ? toOptionalNumber(formData.bdiServicoPercent) : undefined,
    bdiTaxaPercent: !isBdiUnico ? toOptionalNumber(formData.bdiTaxaPercent) : undefined,
    bdiDescontoPercent: toOptionalNumber(formData.bdiDescontoPercent),
    valorTotalObra: toOptionalNumber(formData.valorTotalObra),
    valorTotalConvenio: toOptionalNumber(formData.valorTotalConvenio),
    convenio: formData.convenio.trim() || undefined,
    indicacao: formData.indicacao.trim() || undefined,
    recurso: formData.recurso,
    possuiContrapartida: hasContrapartida,
    valorContrapartida: hasContrapartida
      ? toOptionalNumber(formData.valorContrapartida)
      : undefined,
    dotacoes: dotacoesPayload.length ? dotacoesPayload : undefined,
  };
};

const formatDateInput = (value: Date) => value.toISOString().slice(0, 10);

const numberToInput = (value?: number | null) => (value == null ? "" : String(value));

export const mapObraToFormData = (obra: Obra): ObraFormData => ({
  nome: obra.nome,
  titulo: obra.titulo ?? "",
  tipo: obra.tipo,
  descricao: obra.descricao ?? "",
  status: obra.status,
  dataInicio: formatDateInput(obra.dataInicio),
  dataPrevisaoTermino: formatDateInput(obra.dataPrevisaoTermino),
  construidoM2: numberToInput(obra.construidoM2),
  responsavelNome: obra.responsavelNome ?? "",
  enderecoTipo: obra.enderecoTipo ?? ObraEnderecoTipo.URBANO,
  enderecoLogradouro: obra.enderecoLogradouro ?? "",
  enderecoNumero: obra.enderecoNumero ?? "",
  enderecoBairro: obra.enderecoBairro ?? "",
  enderecoCep: obra.enderecoCep ?? "",
  bdiTipo: obra.bdiTipo ?? ObraBdiTipo.UNICO,
  bdiUnicoPercent: numberToInput(obra.bdiUnicoPercent),
  bdiMaterialPercent: numberToInput(obra.bdiMaterialPercent),
  bdiEquipamentoPercent: numberToInput(obra.bdiEquipamentoPercent),
  bdiMaoDeObraPercent: numberToInput(obra.bdiMaoDeObraPercent),
  bdiServicoPercent: numberToInput(obra.bdiServicoPercent),
  bdiTaxaPercent: numberToInput(obra.bdiTaxaPercent),
  bdiDescontoPercent: numberToInput(obra.bdiDescontoPercent),
  valorTotalObra: numberToInput(obra.valorTotalObra),
  valorTotalConvenio: numberToInput(obra.valorTotalConvenio),
  convenio: obra.convenio ?? "",
  indicacao: obra.indicacao ?? "",
  recurso: obra.recurso ?? ObraRecursoTipo.PROPRIO,
  possuiContrapartida: obra.possuiContrapartida ? "SIM" : "NAO",
  valorContrapartida: numberToInput(obra.valorContrapartida),
});

export const mapDotacoesToForm = (obra: Obra) =>
  obra.dotacoes?.map((dotacao) => ({
    id: dotacao.id,
    projetoAtividade: dotacao.projetoAtividade,
    codigoReduzido: dotacao.codigoReduzido,
    naturezaDespesa: dotacao.naturezaDespesa,
  })) ?? [];
