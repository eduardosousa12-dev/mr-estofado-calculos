import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Servico, TipoServico } from '../types';
import { TIPOS_SERVICO_LABELS } from '../constants/servicos';
import { carregarHistorico } from '../services/storage';
import { calcularCustoProdutos } from '../utils/custos';

interface ServicoCombo {
  id: string;
  tipo: TipoServico;
  descricao: string;
  calculoId: string;
  custoMaoDeObra: number;
  precoVenda: number;
}

interface ModalComboServicosProps {
  clienteId: string;
  onSalvar: (servicos: Servico[]) => void;
  onFechar: () => void;
}

export default function ModalComboServicos({ clienteId: _clienteId, onSalvar, onFechar }: ModalComboServicosProps) {
  const [dataServico, setDataServico] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [servicos, setServicos] = useState<ServicoCombo[]>([
    { id: crypto.randomUUID(), tipo: 'higienizacao', descricao: '', calculoId: '', custoMaoDeObra: 0, precoVenda: 0 }
  ]);

  const historico = carregarHistorico();

  const adicionarServico = () => {
    setServicos([
      ...servicos,
      { id: crypto.randomUUID(), tipo: 'higienizacao', descricao: '', calculoId: '', custoMaoDeObra: 0, precoVenda: 0 }
    ]);
  };

  const removerServico = (id: string) => {
    if (servicos.length > 1) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  const atualizarServico = (id: string, campo: keyof ServicoCombo, valor: string | number) => {
    setServicos(servicos.map(s =>
      s.id === id ? { ...s, [campo]: valor } : s
    ));
  };

  const calcularTotais = () => {
    let custoTotal = 0;
    let precoTotal = 0;

    servicos.forEach(s => {
      const custoProdutos = s.calculoId ? calcularCustoProdutos(s.calculoId) : 0;
      custoTotal += custoProdutos + s.custoMaoDeObra;
      precoTotal += s.precoVenda;
    });

    return { custoTotal, precoTotal, lucroTotal: precoTotal - custoTotal };
  };

  const handleSalvar = () => {
    // Validar
    const servicosInvalidos = servicos.filter(s => !s.descricao.trim() || !s.calculoId);
    if (servicosInvalidos.length > 0) {
      alert('Preencha a descrição e selecione um cálculo para todos os serviços');
      return;
    }

    // Criar os serviços
    const novosServicos: Servico[] = servicos.map(s => {
      const custoProdutos = calcularCustoProdutos(s.calculoId);
      const custoTotal = custoProdutos + s.custoMaoDeObra;
      const lucro = s.precoVenda > 0 ? s.precoVenda - custoTotal : 0;

      return {
        id: crypto.randomUUID(),
        tipo: s.tipo,
        descricao: s.descricao.trim(),
        observacoes: observacoesGerais.trim() || undefined,
        custoProdutos,
        custoMaoDeObra: s.custoMaoDeObra || undefined,
        precoVenda: s.precoVenda || undefined,
        lucro: lucro || undefined,
        calculoId: s.calculoId,
        dataServico,
        createdAt: new Date().toISOString(),
      };
    });

    onSalvar(novosServicos);
  };

  const totais = calcularTotais();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Novo Combo de Serviços
          </h3>
          <button
            onClick={onFechar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Data do Combo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data do Serviço *
              </label>
              <input
                type="date"
                value={dataServico}
                onChange={(e) => setDataServico(e.target.value)}
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Todos os serviços do combo terão esta data
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações Gerais
              </label>
              <input
                type="text"
                value={observacoesGerais}
                onChange={(e) => setObservacoesGerais(e.target.value)}
                className="input-field"
                placeholder="Ex: Combo família, desconto aplicado..."
              />
            </div>
          </div>

          {/* Lista de Serviços */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Serviços do Combo ({servicos.length})
              </label>
              <button
                onClick={adicionarServico}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Adicionar Item
              </button>
            </div>

            <div className="space-y-4">
              {servicos.map((servico, index) => {
                const custoProdutos = servico.calculoId ? calcularCustoProdutos(servico.calculoId) : 0;
                return (
                  <div key={servico.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Item {index + 1}
                      </span>
                      {servicos.length > 1 && (
                        <button
                          onClick={() => removerServico(servico.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tipo *
                        </label>
                        <select
                          value={servico.tipo}
                          onChange={(e) => atualizarServico(servico.id, 'tipo', e.target.value as TipoServico)}
                          className="input-field text-sm"
                        >
                          {Object.entries(TIPOS_SERVICO_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cálculo *
                        </label>
                        <select
                          value={servico.calculoId}
                          onChange={(e) => atualizarServico(servico.id, 'calculoId', e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="">Selecione...</option>
                          {historico.map((calc) => (
                            <option key={calc.id} value={calc.id}>
                              {calc.areaTotal}m² - {new Date(calc.createdAt).toLocaleDateString('pt-BR')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Descrição *
                        </label>
                        <input
                          type="text"
                          value={servico.descricao}
                          onChange={(e) => atualizarServico(servico.id, 'descricao', e.target.value)}
                          className="input-field text-sm"
                          placeholder="Ex: Sofá 3 lugares - sujidade moderada"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mão de Obra (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={servico.custoMaoDeObra || ''}
                          onChange={(e) => atualizarServico(servico.id, 'custoMaoDeObra', Number(e.target.value))}
                          className="input-field text-sm"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Preço Venda (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={servico.precoVenda || ''}
                          onChange={(e) => atualizarServico(servico.id, 'precoVenda', Number(e.target.value))}
                          className="input-field text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {custoProdutos > 0 && (
                      <div className="mt-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                        Custo produtos: R$ {custoProdutos.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo do Combo */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Resumo do Combo</h4>
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Custo Total</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  R$ {totais.custoTotal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Preço Total</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  R$ {totais.precoTotal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lucro Total</p>
                <p className={`text-lg font-bold ${totais.lucroTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  R$ {totais.lucroTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <button onClick={onFechar} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="btn-primary">
            Salvar Combo ({servicos.length} serviços)
          </button>
        </div>
      </div>
    </div>
  );
}
