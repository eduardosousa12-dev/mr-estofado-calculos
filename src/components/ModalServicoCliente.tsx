import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Servico, TipoServico } from '../types';
import { TIPOS_SERVICO_LABELS } from '../constants/servicos';
import { carregarHistorico } from '../services/storage';
import { calcularCustoProdutos } from '../utils/custos';

interface ModalServicoClienteProps {
  servico: Servico | null;
  clienteId: string; // Mantido para compatibilidade futura
  onSalvar: (servico: Servico) => void;
  onFechar: () => void;
}

export default function ModalServicoCliente({ servico, clienteId: _clienteId, onSalvar, onFechar }: ModalServicoClienteProps) {
  const [tipo, setTipo] = useState<TipoServico>('higienizacao');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [calculoId, setCalculoId] = useState<string>('');
  const [custoMaoDeObra, setCustoMaoDeObra] = useState<number>(0);
  const [precoVenda, setPrecoVenda] = useState<number>(0);
  const [dataServico, setDataServico] = useState<string>(new Date().toISOString().split('T')[0]);

  const historico = carregarHistorico();

  useEffect(() => {
    if (servico) {
      setTipo(servico.tipo);
      setDescricao(servico.descricao);
      setObservacoes(servico.observacoes || '');
      setCalculoId(servico.calculoId || '');
      setCustoMaoDeObra(servico.custoMaoDeObra || 0);
      setPrecoVenda(servico.precoVenda || 0);
      setDataServico(servico.dataServico || new Date().toISOString().split('T')[0]);
    } else {
      setTipo('higienizacao');
      setDescricao('');
      setObservacoes('');
      setCalculoId('');
      setCustoMaoDeObra(0);
      setPrecoVenda(0);
      setDataServico(new Date().toISOString().split('T')[0]);
    }
  }, [servico]);

  // Calcular custo automaticamente quando cálculo mudar
  const custoProdutos = calculoId ? calcularCustoProdutos(calculoId) : 0;
  const custoTotal = custoProdutos + custoMaoDeObra;
  const lucro = precoVenda > 0 ? precoVenda - custoTotal : 0;

  const handleSalvar = () => {
    if (!descricao.trim()) {
      alert('Informe a descrição do serviço');
      return;
    }

    if (!calculoId) {
      alert('Selecione um cálculo para calcular o custo automaticamente');
      return;
    }

    const novoServico: Servico = {
      id: servico?.id || crypto.randomUUID(),
      tipo,
      descricao: descricao.trim(),
      observacoes: observacoes.trim() || undefined,
      custoProdutos,
      custoMaoDeObra: custoMaoDeObra || undefined,
      precoVenda: precoVenda || undefined,
      lucro: lucro || undefined,
      calculoId,
      dataServico,
      createdAt: servico?.createdAt || new Date().toISOString(),
    };

    onSalvar(novoServico);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {servico ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          <button
            onClick={onFechar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Tipo de Serviço e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Serviço *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoServico)}
                className="input-field"
              >
                {Object.entries(TIPOS_SERVICO_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
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
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input-field"
              placeholder="Ex: Higienização de sofá 3 lugares"
            />
          </div>

          {/* Cálculo Associado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cálculo Associado * (para calcular custo automaticamente)
            </label>
            {historico.length === 0 ? (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                Nenhum cálculo disponível. Realize um cálculo primeiro na aba "Calculadora".
              </div>
            ) : (
              <select
                value={calculoId}
                onChange={(e) => setCalculoId(e.target.value)}
                className="input-field"
              >
                <option value="">Selecione um cálculo</option>
                {historico.map((calc) => (
                  <option key={calc.id} value={calc.id}>
                    {calc.areaTotal} m² - {calc.resultadosProdutos.length} produto(s) - {new Date(calc.createdAt).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </select>
            )}
            {calculoId && custoProdutos > 0 && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded text-sm text-green-800 dark:text-green-300">
                Custo dos produtos calculado: R$ {custoProdutos.toFixed(2)}
              </div>
            )}
          </div>

          {/* Custos e Preços */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Custos e Preços</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custo Produtos (calculado automaticamente)
                </label>
                <input
                  type="text"
                  value={`R$ ${custoProdutos.toFixed(2)}`}
                  disabled
                  className="input-field bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mão de Obra (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={custoMaoDeObra}
                  onChange={(e) => setCustoMaoDeObra(Number(e.target.value))}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço de Venda (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(Number(e.target.value))}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lucro (calculado automaticamente)
                </label>
                <input
                  type="text"
                  value={`R$ ${lucro.toFixed(2)}`}
                  disabled
                  className={`input-field ${
                    lucro >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Observações adicionais sobre o serviço..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <button onClick={onFechar} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="btn-primary" disabled={!calculoId}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

