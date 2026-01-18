import {
  type CreateTabelaInput,
  CreateTabelaInputSchema,
  type TabelaReferencia,
} from "@repo/contracts";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Info,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../shared/auth-context";
import { cn } from "../../../shared/utils";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5500";

export function AdminPriceBankPage() {
  const { user } = useAuth();
  const [tabelas, setTabelas] = useState<TabelaReferencia[]>([]);
  const [newTabela, setNewTabela] = useState<Partial<CreateTabelaInput>>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    nome: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importLog, setImportLog] = useState("");

  useEffect(() => {
    fetchTabelas();
  }, []);

  const fetchTabelas = async () => {
    try {
      const res = await fetch(`${baseUrl}/v1/tabelas-referencia`, { credentials: "include" });
      const json = await res.json();
      setTabelas(json.tabelas);
    } catch (e) {
      console.error("Erro ao buscar tabelas", e);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = CreateTabelaInputSchema.parse(newTabela);
      const res = await fetch(`${baseUrl}/v1/tabelas-referencia`, {
        credentials: "include",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchTabelas();
        setNewTabela({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear(), nome: "" });
      }
    } catch (e) {
      console.error("Erro ao criar tabela", e);
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
        credentials: "include",
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setImportLog(`Sucesso! ${json.count} itens importados/atualizados.`);
      fetchTabelas();
    } catch (e) {
      setImportLog(`Erro no upload: ${e}`);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (
      !confirm(
        `Tem certeza que deseja apagar a tabela "${nome}"? Esta ação removerá todos os insumos e composições desta tabela e não pode ser desfeita.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/v1/tabelas-referencia/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (res.ok) {
        fetchTabelas();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erro ao apagar tabela");
      }
    } catch (e) {
      console.error("Erro ao apagar tabela", e);
      alert("Erro ao conectar com o servidor");
    }
  };

  if (user?.role !== "ADMIN" && user?.role !== "ENGENHEIRO") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-2xl font-black text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Você não tem permissão para gerenciar o banco de preços global do sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
          <Database size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Banco de Preços</h1>
          <p className="text-slate-500 font-medium">
            Gestão de tabelas referenciais e insumos (SINAPI/ORSE).
          </p>
        </div>
      </div>

      <div className="card-premium space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={20} className="text-primary-600" />
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Nova Tabela de Referência
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2 space-y-2">
            <label
              htmlFor="nome"
              className="text-xs font-black text-slate-400 uppercase tracking-widest"
            >
              Nome da Tabela
            </label>
            <input
              id="nome"
              className="input-field"
              value={newTabela.nome}
              onChange={(e) => setNewTabela({ ...newTabela, nome: e.target.value })}
              placeholder="Ex: SINAPI - MATO GROSSO DO SUL"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="mes"
              className="text-xs font-black text-slate-400 uppercase tracking-widest"
            >
              Mês
            </label>
            <input
              id="mes"
              type="number"
              min="1"
              max="12"
              className="input-field"
              value={newTabela.mes}
              onChange={(e) => setNewTabela({ ...newTabela, mes: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2 flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <label
                htmlFor="ano"
                className="text-xs font-black text-slate-400 uppercase tracking-widest"
              >
                Ano
              </label>
              <input
                id="ano"
                type="number"
                className="input-field"
                value={newTabela.ano}
                onChange={(e) => setNewTabela({ ...newTabela, ano: Number(e.target.value) })}
              />
            </div>
            <button type="button" onClick={handleCreate} className="btn-primary h-[50px] px-8">
              Criar
            </button>
          </div>
        </div>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-slate-400" />
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Tabelas Disponíveis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Identificação
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Referência
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Ação de Importação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium whitespace-nowrap lg:whitespace-normal">
              {tabelas.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Database size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{t.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      <Calendar size={14} />
                      {String(t.mes).padStart(2, "0")}/{t.ano}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex gap-4 items-center justify-end">
                      <div className="relative group/file">
                        <input
                          id={`file-${t.id}`}
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-${t.id}`}
                          className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
                        >
                          <FileSpreadsheet size={14} />
                          {selectedFile?.name || "Selecionar XLSX"}
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImport(t.id)}
                        disabled={!selectedFile || uploading}
                        className="btn-primary py-2 text-xs px-6 disabled:opacity-30"
                      >
                        {uploading ? (
                          <Upload className="animate-bounce" size={14} />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploading ? "Sincronizando..." : "Importar"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(t.id, t.nome)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Apagar Tabela"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {importLog && (
                      <div className="text-[10px] font-black text-emerald-600 mt-2 flex items-center gap-1 justify-end">
                        <CheckCircle2 size={12} />
                        {importLog}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {tabelas.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <Info size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                      Nenhuma tabela cadastrada
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
