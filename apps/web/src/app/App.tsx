import { BrowserRouter, Route, Routes, Navigate, Outlet, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "../shared/auth-context";
import { LoginPage } from "../features/auth/login-page";
import { ObraListPage } from "../features/obras/obra-list-page";
import { ObraFormPage } from "../features/obras/obra-form-page";
import { ObraDetailsPage } from "../features/obras/obra-details-page";
import { OrcamentoPage } from "../features/orcamentos/orcamento-page";
import { AdminPriceBankPage } from "../features/admin/banco-precos/admin-price-bank-page";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return children;
}

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Cerberus</h1>
            <nav className="flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/obras" className="text-gray-600 hover:text-gray-900">
                Obras
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Cerberus</h2>
      <p className="text-gray-600">Selecione um módulo no menu acima.</p>
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
            <Route path="obras/:id" element={<ObraDetailsPage />} />
            <Route path="orcamentos" element={<OrcamentoPage />} />
            <Route path="admin/banco-precos" element={<AdminPriceBankPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
