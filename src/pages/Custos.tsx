import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { carregarClientes } from '../services/storage';

export default function Custos() {
  const [clientes] = useState(carregarClientes());
  const [filtroData, setFiltroData] = useState<string>('');

  // Calcular estatísticas gerais
  const estatisticas = useMemo(() => {
    let custoTotal = 0;
    let receitaTotal = 0;
    let lucroTotal = 0;
    let totalServicos = 0;

    clientes.forEach(cliente => {
      cliente.servicos.forEach(servico => {
        if (!filtroData || servico.dataServico === filtroData) {
          custoTotal += servico.custoProdutos + (servico.custoMaoDeObra || 0);
          receitaTotal += servico.precoVenda || 0;
          lucroTotal += servico.lucro || 0;
          totalServicos++;
        }
      });
    });

    const margemLucro = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;

    return {
      custoTotal,
      receitaTotal,
      lucroTotal,
      margemLucro,
      totalServicos,
      totalClientes: clientes.length,
    };
  }, [clientes, filtroData]);

  // Agrupar por mês
  const servicosPorMes = useMemo(() => {
    const agrupados: Record<string, { custoTotal: number; receitaTotal: number; lucroTotal: number; totalServicos: number }> = {};

    clientes.forEach(cliente => {
      cliente.servicos.forEach(servico => {
        if (servico.dataServico) {
          const data = new Date(servico.dataServico);
          const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

          if (!agrupados[mesAno]) {
            agrupados[mesAno] = { custoTotal: 0, receitaTotal: 0, lucroTotal: 0, totalServicos: 0 };
          }

          agrupados[mesAno].custoTotal += servico.custoProdutos + (servico.custoMaoDeObra || 0);
          agrupados[mesAno].receitaTotal += servico.precoVenda || 0;
          agrupados[mesAno].lucroTotal += servico.lucro || 0;
          agrupados[mesAno].totalServicos++;
        }
      });
    });

    return Object.entries(agrupados)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([mesAno, dados]) => ({
        mesAno,
        ...dados,
      }));
  }, [clientes]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Custos e Lucros</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Análise financeira dos serviços realizados
          </p>
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1">
            Filtrar por data
          </label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Custo Total</p>
            <DollarSign className="text-red-500 dark:text-red-400" size={20} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
            R$ {estatisticas.custoTotal.toFixed(2)}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
            <DollarSign className="text-blue-500 dark:text-blue-400" size={20} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            R$ {estatisticas.receitaTotal.toFixed(2)}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lucro Total</p>
            {estatisticas.lucroTotal >= 0 ? (
              <TrendingUp className="text-green-500 dark:text-green-400" size={20} />
            ) : (
              <TrendingDown className="text-red-500 dark:text-red-400" size={20} />
            )}
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${
            estatisticas.lucroTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            R$ {estatisticas.lucroTotal.toFixed(2)}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Margem de Lucro</p>
            <TrendingUp className="text-gold-500 dark:text-gold-400" size={20} />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gold-600 dark:text-gold-400">
            {estatisticas.margemLucro.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Serviços</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {estatisticas.totalServicos}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Clientes</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {estatisticas.totalClientes}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Média por Dia</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            R$ {estatisticas.totalServicos > 0 ? (estatisticas.receitaTotal / estatisticas.totalServicos).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Serviços por Mês */}
      {servicosPorMes.length > 0 && (
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Análise Mensal
          </h3>
          <div className="space-y-4">
            {servicosPorMes.map(({ mesAno, custoTotal, receitaTotal, lucroTotal, totalServicos }) => {
              const [ano, mes] = mesAno.split('-');
              const nomeMes = new Date(parseInt(ano), parseInt(mes) - 1).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
              });

              return (
                <div
                  key={mesAno}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-600 dark:text-gray-400" size={18} />
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {nomeMes}
                      </h4>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {totalServicos} serviço(s)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Custo</p>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        R$ {custoTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        R$ {receitaTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lucro</p>
                      <p className={`text-sm font-semibold ${
                        lucroTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        R$ {lucroTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {clientes.length === 0 && (
        <div className="card text-center py-8 sm:py-12 px-4">
          <DollarSign className="mx-auto text-gray-400 dark:text-gray-500" size={40} />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mt-3 sm:mt-4">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Cadastre clientes e serviços na aba "Clientes" para ver os custos aqui
          </p>
        </div>
      )}
    </div>
  );
}
