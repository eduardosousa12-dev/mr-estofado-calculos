import { Link } from 'react-router-dom';
import { Trash2, Eye, Calendar, Loader2 } from 'lucide-react';
import { useHistorico } from '../hooks/useSupabase';
import { TIPOS_ESTOFADO_LABELS } from '../constants/presets';

export default function Historico() {
  const { historico, loading, error, remover } = useHistorico();

  const handleRemover = async (resultadoId: string) => {
    if (confirm('Tem certeza que deseja remover este cálculo do histórico?')) {
      await remover(resultadoId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (historico.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Histórico</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Seus cálculos salvos aparecerão aqui
          </p>
        </div>
        <div className="card text-center py-8 sm:py-12 px-4">
          <Calendar className="mx-auto text-gray-400 dark:text-gray-500" size={40} />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mt-3 sm:mt-4">
            Nenhum cálculo salvo
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Realize cálculos e salve-os para consulta posterior
          </p>
          <Link to="/calculadora" className="btn-primary mt-4 inline-block">
            Fazer Novo Cálculo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Histórico</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          {historico.length} cálculo(s) salvo(s)
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {historico.map((resultado) => (
          <div key={resultado.id} className="card p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {TIPOS_ESTOFADO_LABELS[resultado.input.tipoEstofado]}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {resultado.areaTotal} m²
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {resultado.resultadosProdutos.length} produto(s)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {new Date(resultado.createdAt).toLocaleString('pt-BR')}
                  </span>
                  {resultado.clienteNome && (
                    <span>Cliente: {resultado.clienteNome}</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resultado.resultadosProdutos.map((produto) => (
                    <span
                      key={produto.produtoId}
                      className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded"
                    >
                      {produto.produtoNome}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link
                  to="/resultado"
                  state={{ resultado }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-colors"
                  title="Ver detalhes"
                >
                  <Eye size={18} />
                </Link>
                <button
                  onClick={() => handleRemover(resultado.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Remover"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
