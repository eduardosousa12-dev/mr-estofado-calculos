import { Link, useLocation } from 'react-router-dom';
import { Calculator, Package, History, Home, Calendar, DollarSign, Moon, Sun, LogOut, Shield, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { profile, signOut, isSuperAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/calculadora', label: 'Calculadora', icon: Calculator },
    { path: '/clientes', label: 'Clientes', icon: Calendar },
    { path: '/custos', label: 'Custos', icon: DollarSign },
    { path: '/produtos', label: 'Produtos', icon: Package },
    { path: '/historico', label: 'Histórico', icon: History },
  ];

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28 md:h-40">
            <Link to="/" className="flex items-center gap-2 md:gap-4">
              <img
                src="/logo.png"
                alt="Mr Estofado"
                className="h-32 w-32 md:h-44 md:w-44 object-contain"
              />
              <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-primary-500 dark:text-primary-300">
                Mr Estofado Cálculos
              </h1>
            </Link>
            <div className="flex items-center gap-2">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2 mr-2 text-sm text-gray-600 dark:text-gray-400">
                <User size={16} />
                <span>{profile?.nome}</span>
              </div>

              {/* Admin Link */}
              {isSuperAdmin && (
                <Link
                  to="/admin"
                  className={`p-2 rounded-lg transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Administração"
                >
                  <Shield size={20} />
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={theme === 'light' ? 'Ativar modo noturno' : 'Ativar modo claro'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>

              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom transition-colors duration-200">
        <div className="grid grid-cols-3 gap-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-[9px] mt-0.5 leading-tight text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-8">
        {children}
      </main>
    </div>
  );
}
