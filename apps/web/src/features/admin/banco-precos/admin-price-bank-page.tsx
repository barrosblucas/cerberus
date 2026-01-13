
import { useState, useEffect } from "react";
import { CreateTabelaInput, CreateTabelaInputSchema, TabelaReferencia } from "@repo/contracts";
import { useAuth } from "../../../shared/auth-context";

// Inline API calls for MVP (should move to api-client)
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export function AdminPriceBankPage() {
    const { user } = useAuth();
    const [tabelas, setTabelas] = useState<TabelaReferencia[]>([]);
    const [newTabela, setNewTabela] = useState<Partial<CreateTabelaInput>>({ mes: 1, ano: 2026, nome: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [importLog, setImportLog] = useState("");

    useEffect(() => {
        fetchTabelas();
    }, []);

    const fetchTabelas = async () => {
        const res = await fetch(`${baseUrl}/v1/tabelas-referencia`);
        const json = await res.json();
        setTabelas(json.tabelas);
    };

    const handleCreate = async () => {
        try {
            const payload = CreateTabelaInputSchema.parse(newTabela);
            const res = await fetch(`${baseUrl}/v1/tabelas-referencia`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchTabelas();
                setNewTabela({ mes: 1, ano: 2026, nome: "" });
            }
        } catch (e) {
            alert("Erro ao criar tabela: " + e);
        }
    };

    const handleImport = async (tabelaId: string) => {
        if (!selectedFile) return;
        setUploading(true);
        setImportLog("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await fetch(`${baseUrl}/v1/tabelas-referencia/${tabelaId}/import`, {
                method: "POST",
                body: formData
            });
            const json = await res.json();
            setImportLog(`Sucesso! ${json.count} itens importados/atualizados.`);
        } catch (e) {
            setImportLog("Erro no upload: " + e);
        } finally {
            setUploading(false);
            setSelectedFile(null);
        }
    };

    if (user?.role !== "ADMIN" && user?.role !== "ENGENHEIRO") {
        return <div className="p-8">Acesso negado.</div>;
    }

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-2xl font-bold">Gerenciar Banco de Preços</h1>

            <div className="bg-white p-6 rounded shadow space-y-4">
                <h3 className="font-semibold">Nova Tabela de Referência</h3>
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm">Nome</label>
                        <input className="border rounded px-2 py-1 w-64" value={newTabela.nome} onChange={e => setNewTabela({ ...newTabela, nome: e.target.value })} placeholder="Ex: SINAPI - FEV/2026" />
                    </div>
                    <div>
                        <label className="block text-sm">Mês</label>
                        <input type="number" className="border rounded px-2 py-1 w-20" value={newTabela.mes} onChange={e => setNewTabela({ ...newTabela, mes: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm">Ano</label>
                        <input type="number" className="border rounded px-2 py-1 w-24" value={newTabela.ano} onChange={e => setNewTabela({ ...newTabela, ano: Number(e.target.value) })} />
                    </div>
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Criar</button>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Nome</th>
                            <th className="px-4 py-2 text-left">Referência</th>
                            <th className="px-4 py-2 text-left">Importar XLSX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tabelas.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="px-4 py-3">{t.nome}</td>
                                <td className="px-4 py-3">{t.mes}/{t.ano}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <input type="file" accept=".xlsx" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="text-sm" />
                                        <button
                                            onClick={() => handleImport(t.id)}
                                            disabled={!selectedFile || uploading}
                                            className="bg-green-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                                        >
                                            {uploading ? "Enviando..." : "Enviar"}
                                        </button>
                                    </div>
                                    {importLog && <div className="text-xs text-green-600 mt-1">{importLog}</div>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
