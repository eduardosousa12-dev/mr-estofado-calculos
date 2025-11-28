import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Produto, NivelSujidade, TipoEstofado, Diluicao } from '../types';
import { TIPOS_ESTOFADO_LABELS, NIVEL_SUJIDADE_LABELS } from '../constants/presets';

interface ModalProdutoProps {
  produto: Produto | null;
  onSalvar: (produto: Produto) => void;
  onFechar: () => void;
}

export default function ModalProduto({ produto, onSalvar, onFechar }: ModalProdutoProps) {
  const [nome, setNome] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [diluicoes, setDiluicoes] = useState<Diluicao[]>([]);
  const [tiposEstofado, setTiposEstofado] = useState<TipoEstofado[]>([]);
  const [unidadeMedida, setUnidadeMedida] = useState<'ml' | 'litros'>('ml');
  const [valorPago, setValorPago] = useState<number>(0);
  const [quantidadeEmbalagem, setQuantidadeEmbalagem] = useState<number>(0);
  const [rendimentoPorM2, setRendimentoPorM2] = useState<number>(0);
  const [observacoes, setObservacoes] = useState('');

  // Calcula automaticamente o custo por unidade
  const custoPorUnidade = quantidadeEmbalagem > 0 ? valorPago / quantidadeEmbalagem : 0;

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setFabricante(produto.fabricante || '');
      setDiluicoes(produto.diluicoes);
      setTiposEstofado(produto.tiposEstofadoCompativel);
      setUnidadeMedida(produto.unidadeMedida);
      setValorPago(produto.valorPago || 0);
      setQuantidadeEmbalagem(produto.quantidadeEmbalagem || 0);
      setRendimentoPorM2(produto.rendimentoPorM2 || 0);
      setObservacoes(produto.observacoes || '');
    } else {
      // Inicializar com diluições padrão
      const niveis: NivelSujidade[] = ['leve', 'moderado', 'pesado', 'extremo'];
      setDiluicoes(
        niveis.map(nivel => ({
          nivel,
          proporcao: nivel === 'leve' ? '1:30' : nivel === 'moderado' ? '1:20' : nivel === 'pesado' ? '1:15' : '1:10',
        }))
      );
    }
  }, [produto]);

  const handleDiluicaoChange = (nivel: NivelSujidade, proporcao: string) => {
    setDiluicoes(prev =>
      prev.map(d => (d.nivel === nivel ? { ...d, proporcao } : d))
    );
  };

  const toggleTipoEstofado = (tipo: TipoEstofado) => {
    setTiposEstofado(prev =>
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  };

  const handleSalvar = () => {
    if (!nome.trim()) {
      alert('Informe o nome do produto');
      return;
    }

    if (diluicoes.length === 0) {
      alert('Configure pelo menos uma diluição');
      return;
    }

    if (valorPago <= 0) {
      alert('Informe o valor pago pelo produto');
      return;
    }

    if (quantidadeEmbalagem <= 0) {
      alert('Informe a quantidade da embalagem');
      return;
    }

    const novoProduto: Produto = {
      id: produto?.id || crypto.randomUUID(),
      nome: nome.trim(),
      fabricante: fabricante.trim() || undefined,
      diluicoes,
      tiposEstofadoCompativel: tiposEstofado,
      unidadeMedida,
      valorPago,
      quantidadeEmbalagem,
      custoPorUnidade,
      rendimentoPorM2: rendimentoPorM2 || 0,
      observacoes: observacoes.trim() || undefined,
      createdAt: produto?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSalvar(novoProduto);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {produto ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button
            onClick={onFechar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
              placeholder="Ex: Extratora Plus"
            />
          </div>

          {/* Fabricante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fabricante
            </label>
            <input
              type="text"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
              className="input-field"
              placeholder="Opcional"
            />
          </div>

          {/* Diluições */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tabela de Diluição *
            </label>
            <div className="space-y-3">
              {(['leve', 'moderado', 'pesado', 'extremo'] as NivelSujidade[]).map((nivel) => {
                const diluicao = diluicoes.find(d => d.nivel === nivel);
                return (
                  <div key={nivel} className="flex items-center gap-3">
                    <label className="w-24 text-sm text-gray-700 dark:text-gray-300">
                      {NIVEL_SUJIDADE_LABELS[nivel]}:
                    </label>
                    <input
                      type="text"
                      value={diluicao?.proporcao || ''}
                      onChange={(e) => handleDiluicaoChange(nivel, e.target.value)}
                      className="input-field flex-1"
                      placeholder="Ex: 1:20"
                      pattern="\d+:\d+"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">(produto:água)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tipos de Estofado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipos de Estofado Compatíveis
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Deixe vazio para compatível com todos
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
              {Object.entries(TIPOS_ESTOFADO_LABELS).map(([tipo, label]) => (
                <button
                  key={tipo}
                  onClick={() => toggleTipoEstofado(tipo as TipoEstofado)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                    tiposEstofado.includes(tipo as TipoEstofado)
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Unidade de Medida, Valor Pago e Quantidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unidade de Medida
              </label>
              <select
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value as 'ml' | 'litros')}
                className="input-field"
              >
                <option value="ml">ml</option>
                <option value="litros">Litros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor Pago (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valorPago || ''}
                onChange={(e) => setValorPago(Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 45.00"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Quanto você pagou pelo produto
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantidade ({unidadeMedida}) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={quantidadeEmbalagem || ''}
                onChange={(e) => setQuantidadeEmbalagem(Number(e.target.value))}
                className="input-field"
                placeholder={unidadeMedida === 'ml' ? 'Ex: 1000' : 'Ex: 5'}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Quantidade na embalagem
              </p>
            </div>
          </div>

          {/* Rendimento por m² */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rendimento por m² (ml de solução)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={rendimentoPorM2 || ''}
              onChange={(e) => setRendimentoPorM2(Number(e.target.value))}
              className="input-field"
              placeholder="Ex: 100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recomendação do fabricante. Se não souber, deixe em branco (será usado cálculo padrão por nível de sujidade)
            </p>
          </div>

          {/* Custo Calculado */}
          {custoPorUnidade > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Custo calculado:</span>{' '}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  R$ {custoPorUnidade.toFixed(4)} por {unidadeMedida === 'ml' ? 'ml' : 'litro'}
                </span>
              </p>
            </div>
          )}

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
              placeholder="Instruções especiais, tempo de ação, etc."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button onClick={onFechar} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="btn-primary">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
