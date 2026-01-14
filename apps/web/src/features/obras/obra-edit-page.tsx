import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ObraForm } from "./obra-form";
import {
  type DotacaoField,
  type DotacaoInput,
  type ObraFormData,
  buildObraPayload,
  createDotacaoInput,
  mapDotacoesToForm,
  mapObraToFormData,
} from "./obra-form-data";
import { useObra, useUpdateObra } from "./use-obras";

export function ObraEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const obraId = id ?? "";
  const { data: obra, isLoading } = useObra(obraId);
  const updateMutation = useUpdateObra(obraId);

  const [formData, setFormData] = useState<ObraFormData | null>(null);
  const [dotacoes, setDotacoes] = useState<DotacaoInput[]>([createDotacaoInput()]);

  useEffect(() => {
    if (!obra) return;
    setFormData(mapObraToFormData(obra));
    const mapped = mapDotacoesToForm(obra);
    setDotacoes(mapped.length ? mapped : [createDotacaoInput()]);
  }, [obra]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (!formData) return;
    const { name, value } = event.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleDotacaoChange = (index: number, field: DotacaoField, value: string) => {
    setDotacoes((prev) =>
      prev.map((dotacao, idx) =>
        idx === index
          ? {
              ...dotacao,
              [field]: value,
            }
          : dotacao,
      ),
    );
  };

  const addDotacao = () => {
    setDotacoes((prev) => [...prev, createDotacaoInput()]);
  };

  const removeDotacao = (index: number) => {
    setDotacoes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData) return;
    const payload = buildObraPayload(formData, dotacoes);

    try {
      await updateMutation.mutateAsync(payload);
      navigate(`/obras/${obraId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !formData)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-xl w-48" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          to={`/obras/${obraId}`}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-400" />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Editar Obra</h2>
          <p className="text-slate-500 font-medium">Atualize as informações do projeto.</p>
        </div>
      </div>

      <ObraForm
        formData={formData}
        dotacoes={dotacoes}
        isSubmitting={updateMutation.isPending}
        submitLabel="Salvar Alterações"
        onChange={handleChange}
        onDotacaoChange={handleDotacaoChange}
        onAddDotacao={addDotacao}
        onRemoveDotacao={removeDotacao}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
