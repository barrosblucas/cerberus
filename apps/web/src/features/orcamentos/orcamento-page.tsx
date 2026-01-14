import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calculator,
  ChevronLeft,
  FileSpreadsheet,
  Info,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createOrcamento,
  getObra,
  getOrcamento,
  listObras,
  saveOrcamentoItems,
} from "../../shared/api-client";
import { cn } from "../../shared/utils";
import { CompositionModal } from "./composition-modal";
import { ItemSearch } from "./item-search";

interface OrcamentoItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
  insumoId?: string;
  composicaoId?: string;
  isComposicao?: boolean;
}

export function OrcamentoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get("id");
  const preselectedObraId = searchParams.get("obraId");

  const [obras, setObras] = useState<any[]>([]);
  const [selectedObraId, setSelectedObraId] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("Orçamento Base");
  const [items, setItems] = useState<OrcamentoItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedCompositionId, setSelectedCompositionId] = useState<string | null>(null);

  useEffect(() => {
    listObras().then(setObras).catch(console.error);
    if (preselectedObraId) setSelectedObraId(preselectedObraId);
    if (budgetId) loadBudget(budgetId);
  }, [budgetId, preselectedObraId]);

  const loadBudget = async (id: string) => {
    try {
      const { orcamento } = await getOrcamento(id);
      setBudgetTitle(orcamento.nome);
      setSelectedObraId(orcamento.obraId);
      const flatItems: OrcamentoItem[] = [];
      orcamento.etapas?.forEach((etapa: any) => {
        etapa.itens?.forEach((item: any) => {
          flatItems.push({
            id: crypto.randomUUID(),
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            total: item.valorTotal,
            insumoId: item.insumoId,
            composicaoId: item.composicaoId,
            isComposicao: !!item.composicaoId,
          });
        });
      });
      setItems(flatItems);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (item: any) => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        codigo: item.codigo,
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: 1,
        valorUnitario: item.preco,
        total: item.preco * 1,
        insumoId: item.tipo === "INSUMO" ? item.id : undefined,
        composicaoId: item.tipo === "COMPOSICAO" ? item.id : undefined,
        isComposicao: item.tipo === "COMPOSICAO",
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          return { ...i, quantidade: qty, total: qty * i.valorUnitario };
        }
        return i;
      }),
    );
  };

  const totalBudget = items.reduce((acc, i) => acc + i.total, 0);

  const handleSave = async () => {
    if (!selectedObraId) return;
    setSaving(true);
    try {
      let targetId = budgetId;
      if (!targetId) {
        const { orcamento } = await createOrcamento({
          obraId: selectedObraId,
          nome: budgetTitle,
          dataBaseMonth: 1,
          dataBaseYear: 2026,
        });
        targetId = orcamento.id;
      }
      await saveOrcamentoItems(targetId!, {
        total: totalBudget,
        etapas: [
          {
            ordem: 1,
            nome: "Etapa Geral",
            itens: items.map((item, idx) => ({
              ordem: idx + 1,
              codigo: item.codigo,
              descricao: item.descricao,
              unidade: item.unidade,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              valorTotal: item.total,
              origem: "SINAPI",
              insumoId: item.insumoId,
              composicaoId: item.composicaoId,
            })),
          },
        ],
      });
      if (!budgetId) navigate(`/orcamentos?id=${targetId}`);
    } catch (e: any) {
      alert(`Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={24} className="text-slate-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-primary-600 uppercase tracking-widest leading-none">
              <FileSpreadsheet size={14} />
              <span>Gestão de Custo</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{budgetTitle}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedObraId}
            className="btn-primary min-w-[160px]"
          >
            {saving ? <Save className="animate-pulse" size={20} /> : <Save size={20} />}
            <span>{saving ? "Salvando..." : "Salvar Orçamento"}</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="obra-select"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <Building2 size={16} className="text-slate-400" />
                Obra Vinculada
              </label>
              <select
                id="obra-select"
                className="input-field"
                value={selectedObraId}
                onChange={(e) => setSelectedObraId(e.target.value)}
              >
                <option value="">Selecione a obra...</option>
                {obras.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="budget-title" className="text-sm font-bold text-slate-700">
                Identificação do Orçamento
              </label>
              <input
                id="budget-title"
                className="input-field"
                placeholder="Ex: Planilha de Custos Adicional"
                value={budgetTitle}
                onChange={(e) => setBudgetTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Plus size={18} className="text-primary-600" />
              <span className="font-bold text-slate-800">Adicionar Itens do Banco de Preços</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
              <ItemSearch onSelect={handleAddItem} />
            </div>
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="card-premium bg-slate-900 text-white border-none relative overflow-hidden flex flex-col justify-between">
          <Calculator className="absolute -right-8 -top-8 text-white/5 w-48 h-48 -rotate-12" />
          <div>
            <p className="text-primary-400 font-bold text-xs uppercase tracking-widest mb-2">
              Total Estimado
            </p>
            <h3 className="text-4xl font-black">
              R$ {totalBudget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-primary-300 text-sm font-medium">
              <AlertCircle size={16} />
              <span>Base SINAPI Jan/2026</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-sm opacity-60 font-medium">
              <span>Total de Itens</span>
              <span>{items.length}</span>
            </div>
            <div className="flex justify-between text-sm opacity-60 font-medium">
              <span>Leis Sociais</span>
              <span>Não incluso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card-premium p-0 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">
                  Código
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Descrição do Serviço
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Unid
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-32">
                  Quantidade
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">
                  Vlr. Unitário
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Vlr. Total
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 font-mono tracking-tighter bg-slate-100 px-2 py-1 rounded text-xs">
                        {item.codigo}
                      </span>
                      {item.isComposicao && (
                        <button
                          onClick={() => setSelectedCompositionId(item.composicaoId!)}
                          className="p-1 text-primary-500 hover:bg-primary-50 rounded"
                          title="Ver Composição"
                        >
                          <Info size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700 text-sm leading-relaxed">
                    {item.descricao}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-500 font-bold uppercase text-[10px]">
                    {item.unidade}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-right font-black text-slate-800 focus:bg-white focus:border-primary-500 outline-none transition-all"
                      value={item.quantidade}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-6 text-right text-slate-500">
                    R$ {item.valorUnitario?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900">
                    R$ {item.total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <FileSpreadsheet size={48} className="text-slate-200 mb-4" />
                      <h3 className="text-xl font-bold text-slate-800">Planilha Vazia</h3>
                      <p className="text-slate-500 max-w-xs mx-auto">
                        Use o campo de busca acima para adicionar insumos e composições SINAPI.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompositionId && (
        <CompositionModal
          id={selectedCompositionId}
          onClose={() => setSelectedCompositionId(null)}
        />
      )}
    </div>
  );
}
