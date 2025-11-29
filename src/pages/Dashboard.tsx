import { Link } from 'react-router-dom';
import { Calculator, Package, History, TrendingUp, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useProdutos, useHistorico } from '../hooks/useSupabase';

export default function Dashboard() {
  const { produtos, loading: loadingProdutos } = useProdutos();
  const { historico, loading: loadingHistorico } = useHistorico();

  const loading = loadingProdutos || loadingHistorico;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  const stats = [
    {
      label: 'Produtos Cadastrados',
      value: produtos.length,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Cálculos Realizados',
      value: historico.length,
      icon: History,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Cálculos este Mês',
      value: historico.filter(h => {
        const date = new Date(h.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'text-gold-600 dark:text-gold-400',
      bgColor: 'bg-gold-100 dark:bg-gold-900/30',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          Gerencie seus produtos e realize cálculos de diluição
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full ml-2`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/calculadora"
          className="card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-3 sm:p-4 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors flex-shrink-0">
              <Calculator className="text-primary-500 dark:text-primary-400" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Nova Calculadora
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Calcule a quantidade de produtos necessários
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/clientes"
          className="card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gold-100 dark:bg-gold-900/30 p-3 sm:p-4 rounded-lg group-hover:bg-gold-200 dark:group-hover:bg-gold-900/50 transition-colors flex-shrink-0">
              <Calendar className="text-gold-600 dark:text-gold-400" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Clientes
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Gerencie clientes e seus serviços
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/custos"
          className="card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 sm:p-4 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors flex-shrink-0">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Custos e Lucros
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Análise financeira dos serviços
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/produtos"
          className="card p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 sm:p-4 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors flex-shrink-0">
              <Package className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Gerenciar Produtos
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Cadastre e edite seus produtos químicos
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Calculations */}
      {historico.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Cálculos Recentes
            </h3>
            <Link
              to="/historico"
              className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {historico.slice(0, 5).map((calc) => (
              <div
                key={calc.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {calc.areaTotal} m² - {calc.resultadosProdutos.length} produto(s)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(calc.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Link
                  to="/resultado"
                  state={{ resultado: calc }}
                  className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 text-sm font-medium"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

