import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AdminPriceBankPage } from "../features/admin/banco-precos/admin-price-bank-page";
import { LoginPage } from "../features/auth/login-page";
import { ObraDetailsPage } from "../features/obras/obra-details-page";
import { ObraEditPage } from "../features/obras/obra-edit-page";
import { ObraFormPage } from "../features/obras/obra-form-page";
import { ObraListPage } from "../features/obras/obra-list-page";
import { OrcamentoPage } from "../features/orcamentos/orcamento-page";
import { AuthProvider, useAuth } from "../shared/auth-context";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return children;
}

import {
  ChevronRight,
  HardHat,
  Landmark,
  LayoutDashboard,
  LogOut,
  PackageSearch,
} from "lucide-react";
import { cn } from "../shared/utils";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const menuItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Obras", href: "/obras", icon: HardHat },
    { label: "Orcamentos", href: "/orcamentos", icon: Landmark },
    { label: "Banco de Preços", href: "/admin/banco-precos", icon: PackageSearch },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
            <Landmark className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">Cerberus</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={cn(
                      isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-primary-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 glass-card border-none bg-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold"
          >
            <LogOut size={18} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 glass-card mx-8 mt-6 flex items-center px-8 border-none sticky top-6 z-10 animate-fade-in">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider text-xs opacity-50">
              Governo de Bandeirantes
            </h2>
            <p className="text-slate-600 font-medium">Portal de Controle e Transparência</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Versão 2.4.0
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 min-h-screen animate-slide-up">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { ArrowUpRight, Calendar, FileText, TrendingUp, Users } from "lucide-react";

function DashboardHome() {
  const stats = [
    {
      label: "Obras Ativas",
      value: "12",
      icon: HardHat,
      color: "bg-blue-500",
      trend: "+2 este mês",
    },
    {
      label: "Orçamentos",
      value: "R$ 4.2M",
      icon: Landmark,
      color: "bg-emerald-500",
      trend: "15% acima",
    },
    { label: "Usuários", value: "24", icon: Users, color: "bg-violet-500", trend: "3 pendentes" },
    { label: "Relatórios", value: "156", icon: FileText, color: "bg-amber-500", trend: "+12 hoje" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500 mt-1">
            Bem-vindo de volta! Aqui está o que está acontecendo hoje.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <Calendar size={20} />
          <span>Janeiro 2026</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-premium group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp size={12} />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 font-medium text-sm">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card-premium">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Atividades Recentes</h3>
            <button
              type="button"
              className="text-primary-600 font-semibold text-sm hover:underline"
            >
              Ver tudo
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  <HardHat size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">
                    Nova obra iniciada: Escola Municipal Central
                  </p>
                  <p className="text-sm text-slate-500">Atualizado por João Silva há 2 horas</p>
                </div>
                <ArrowUpRight
                  className="text-slate-300 group-hover:text-primary-500 transition-colors"
                  size={20}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card-premium bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
            <h3 className="text-xl font-bold mb-2">Novo Projeto?</h3>
            <p className="opacity-80 mb-6 text-sm">
              Comece um novo orçamento agora mesmo usando nosso banco de preços integrado.
            </p>
            <Link
              to="/obras/new"
              className="w-full bg-white text-primary-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              Nova Obra
            </Link>
          </div>

          <div className="card-premium">
            <h3 className="font-bold text-slate-800 mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              <Link
                to="/orcamentos"
                className="block p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors border border-transparent hover:border-slate-100"
              >
                Gerenciar Orçamentos
              </Link>
              <Link
                to="/admin/banco-precos"
                className="block p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors border border-transparent hover:border-slate-100"
              >
                Tabela SINAPI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="obras" element={<ObraListPage />} />
            <Route path="obras/new" element={<ObraFormPage />} />
            <Route path="obras/:id/editar" element={<ObraEditPage />} />
            <Route path="obras/:id" element={<ObraDetailsPage />} />
            <Route path="orcamentos" element={<OrcamentoPage />} />
            <Route path="admin/banco-precos" element={<AdminPriceBankPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
