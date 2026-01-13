import { useState, useEffect } from "react";
import { ItemSearch } from "./item-search";
import { createOrcamento, saveOrcamentoItems, listObras, getObra } from "../../shared/api-client";
import { useNavigate } from "react-router-dom";

interface OrcamentoItem {
    id: string; // Gen new UUID if new
    codigo: string;
    descricao: string;
    unidade: string;
    quantidade: number;
    valorUnitario: number;
    total: number;
    insumoId?: string;
    composicaoId?: string;
}

export function OrcamentoPage() {
    const navigate = useNavigate();
    const [obras, setObras] = useState<any[]>([]);
    const [selectedObraId, setSelectedObraId] = useState("");
    const [budgetTitle, setBudgetTitle] = useState("Orçamento Base");
    const [items, setItems] = useState<OrcamentoItem[]>([]);
    const [saving, setSaving] = useState(false);
    // Logic for Edit Mode (loading existing budget) omitted for prototype, assumes Create Mode.

    useEffect(() => {
        listObras().then(setObras).catch(console.error);
    }, []);

    const handleAddItem = (item: any) => {
        setItems(prev => [...prev, {
            id: crypto.randomUUID(),
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            quantidade: 1, // Default
            valorUnitario: item.preco,
            total: item.preco * 1,
            insumoId: item.tipo === "INSUMO" ? item.id : undefined,
            composicaoId: item.tipo === "COMPOSICAO" ? item.id : undefined
        }]);
    };

    const updateQuantity = (id: string, qty: number) => {
        setItems(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, quantidade: qty, total: qty * i.valorUnitario };
            }
            return i;
        }));
    };

    const totalBudget = items.reduce((acc, i) => acc + i.total, 0);

    const handleSave = async () => {
        if (!selectedObraId) {
            alert("Selecione uma Obra!");
            return;
        }
        setSaving(true);
        try {
            // 1. Create Header
            const { orcamento } = await createOrcamento({
                obraId: selectedObraId,
                nome: budgetTitle,
                dataBaseMonth: 1,
                dataBaseYear: 2026
            });

            // 2. Save Items (Full Sync)
            await saveOrcamentoItems(orcamento.id, {
                total: totalBudget,
                etapas: [
                    {
                        ordem: 1,
                        nome: "Etapa Geral (MVP)",
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
                            composicaoId: item.composicaoId
                        }))
                    }
                ]
            });

            alert("Orçamento salvo com sucesso!");
            // Optionally navigate or reset
        } catch (e: any) {
            alert("Erro ao salvar: " + e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Orçamento</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                    {saving ? "Salvando..." : "Salvar Orçamento"}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
                <div>
                    <label className="block text-sm font-semibold mb-1">Obra</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedObraId}
                        onChange={e => setSelectedObraId(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Título</label>
                    <input
                        className="w-full border rounded px-3 py-2"
                        value={budgetTitle}
                        onChange={e => setBudgetTitle(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-4 bg-blue-50 border rounded space-y-2">
                <label className="text-sm font-semibold">Adicionar Item (Banco de Preços)</label>
                <ItemSearch onSelect={handleAddItem} />
            </div>

            <div className="bg-white border rounded overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left w-1/2">Descrição</th>
                            <th className="px-4 py-2 text-left">Und</th>
                            <th className="px-4 py-2 text-right">Qtd</th>
                            <th className="px-4 py-2 text-right">Unitário</th>
                            <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="px-4 py-2">{item.codigo}</td>
                                <td className="px-4 py-2">{item.descricao}</td>
                                <td className="px-4 py-2">{item.unidade}</td>
                                <td className="px-4 py-2 text-right">
                                    <input
                                        type="number"
                                        className="w-20 border rounded px-1 text-right"
                                        value={item.quantidade}
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                    />
                                </td>
                                <td className="px-4 py-2 text-right">{item.valorUnitario.toFixed(2)}</td>
                                <td className="px-4 py-2 text-right font-semibold">{item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    Nenhum item adicionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold">
                        <tr>
                            <td colSpan={5} className="px-4 py-2 text-right">Total Geral</td>
                            <td className="px-4 py-2 text-right">R$ {totalBudget.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
