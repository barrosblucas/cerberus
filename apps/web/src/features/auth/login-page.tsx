import { ArrowRight, Landmark, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/auth-context";
import { cn } from "../../shared/utils";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200">
              <Landmark className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cerberus</h1>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest">
                Portal de Gestão
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Bem-vindo de volta</h2>
            <p className="text-slate-500 mt-2">
              Acesse sua conta para gerenciar obras e orçamentos do município.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-700 flex items-center gap-2"
              >
                <Mail size={16} className="text-slate-400" />
                Email Corporativo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@bandeirantes.ms.gov.br"
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700 flex items-center gap-2"
                >
                  <Lock size={16} className="text-slate-400" />
                  Sua Senha
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-slide-down">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full btn-primary h-14 text-lg">
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-12 border-t border-slate-100 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span className="text-xs font-medium">Acesso Seguro SSL</span>
            </div>
            <span className="text-xs font-medium">© 2026 Pref. de Bandeirantes</span>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative flex-1">
        <img
          src="/login_background_1768347903501.png"
          alt="Bandeirantes Government Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/40 to-transparent flex flex-col justify-end p-20">
          <div className="max-w-lg space-y-4 animate-slide-up">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
              Digital Government Initative
            </div>
            <h3 className="text-5xl font-black text-white leading-[1.1]">
              Modernizando a gestão pública com transparência.
            </h3>
            <p className="text-primary-100 text-lg opacity-80">
              Cerberus é a plataforma central para controle de obras municipais em Bandeirantes/MS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
