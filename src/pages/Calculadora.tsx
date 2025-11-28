import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Ruler, Droplet, Package } from 'lucide-react';
import { TipoEstofado, NivelSujidade, DimensoesEstofado, CalculoInput } from '../types';
import { PRESETS_ESTOFADOS, TIPOS_ESTOFADO_LABELS, NIVEL_SUJIDADE_LABELS } from '../constants/presets';
import { carregarProdutos } from '../services/storage';
import { calcularResultado } from '../utils/calculos';

export default function Calculadora() {
  const navigate = useNavigate();
  const produtos = carregarProdutos();

  const [tipoEstofado, setTipoEstofado] = useState<TipoEstofado>('sofa-2-lugares');
  const [dimensoes, setDimensoes] = useState<DimensoesEstofado>({
    largura: 150,
    comprimento: 90,
    profundidade: 80,
  });
  const [nivelSujidade, setNivelSujidade] = useState<NivelSujidade>('moderado');
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);
  const [usarPreset, setUsarPreset] = useState(false);

  // Aplicar preset quando tipo de estofado mudar
  useEffect(() => {
    if (usarPreset) {
      const preset = PRESETS_ESTOFADOS.find(p => p.tipo === tipoEstofado);
      if (preset) {
        setDimensoes(preset.dimensoes);
      }
    }
  }, [tipoEstofado, usarPreset]);

  const handlePresetChange = (presetTipo: TipoEstofado) => {
    const preset = PRESETS_ESTOFADOS.find(p => p.tipo === presetTipo);
    if (preset) {
      setTipoEstofado(presetTipo);
      setDimensoes(preset.dimensoes);
      setUsarPreset(true);
    }
  };

  const handleCalcular = () => {
    if (produtosSelecionados.length === 0) {
      alert('Selecione pelo menos um produto');
      return;
    }

    const input: CalculoInput = {
      tipoEstofado,
      dimensoes,
      nivelSujidade,
      produtosSelecionados,
    };

    const resultado = calcularResultado(input, produtos);
    navigate('/resultado', { state: { resultado } });
  };

  const toggleProduto = (produtoId: string) => {
    setProdutosSelecionados(prev =>
      prev.includes(produtoId)
        ? prev.filter(id => id !== produtoId)
        : [...prev, produtoId]
    );
  };

  if (produtos.length === 0) {
    return (
      <div className="card text-center">
        <Package className="mx-auto text-gray-400 dark:text-gray-500" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Nenhum produto cadastrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Cadastre pelo menos um produto antes de fazer cálculos
        </p>
        <button
          onClick={() => navigate('/produtos')}
          className="btn-primary mt-4"
        >
          Cadastrar Produto
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Calculadora</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          Informe as dimensões e selecione os produtos para calcular
        </p>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="text-primary-500 dark:text-primary-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Informações do Estofado
          </h3>
        </div>

        {/* Presets */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Presets Rápidos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS_ESTOFADOS.map((preset) => (
              <button
                key={preset.tipo}
                onClick={() => handlePresetChange(preset.tipo)}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors text-left"
              >
                {preset.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Estofado */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Estofado
          </label>
          <select
            value={tipoEstofado}
            onChange={(e) => {
              setTipoEstofado(e.target.value as TipoEstofado);
              setUsarPreset(false);
            }}
            className="input-field"
          >
            {Object.entries(TIPOS_ESTOFADO_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Dimensões */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="text-gray-600 dark:text-gray-400" size={18} />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dimensões (cm)
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Largura (cm)
              </label>
              <input
                type="number"
                value={dimensoes.largura}
                onChange={(e) =>
                  setDimensoes({ ...dimensoes, largura: Number(e.target.value) })
                }
                className="input-field text-sm"
                min="1"
                placeholder="Ex: 150"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {tipoEstofado.startsWith('colchao') ? 'Comprimento (cm)' : 'Profundidade Assento (cm)'}
              </label>
              <input
                type="number"
                value={dimensoes.comprimento}
                onChange={(e) =>
                  setDimensoes({ ...dimensoes, comprimento: Number(e.target.value) })
                }
                className="input-field text-sm"
                min="1"
                placeholder={tipoEstofado.startsWith('colchao') ? 'Ex: 190' : 'Ex: 90'}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {tipoEstofado.startsWith('colchao') ? 'Altura (cm)' : 'Altura Encosto (cm)'}
              </label>
              <input
                type="number"
                value={dimensoes.profundidade}
                onChange={(e) =>
                  setDimensoes({ ...dimensoes, profundidade: Number(e.target.value) })
                }
                className="input-field text-sm"
                min="1"
                placeholder={tipoEstofado.startsWith('colchao') ? 'Ex: 25' : 'Ex: 80'}
              />
            </div>
          </div>
        </div>

        {/* Nível de Sujidade */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="text-gray-600 dark:text-gray-400" size={18} />
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Nível de Sujidade
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(NIVEL_SUJIDADE_LABELS) as NivelSujidade[]).map((nivel) => (
              <button
                key={nivel}
                onClick={() => setNivelSujidade(nivel)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  nivelSujidade === nivel
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {NIVEL_SUJIDADE_LABELS[nivel]}
              </button>
            ))}
          </div>
        </div>

        {/* Produtos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Produtos a Utilizar
          </label>
          <div className="space-y-2">
            {produtos.map((produto) => {
              const isSelected = produtosSelecionados.includes(produto.id);
              const isCompatible = produto.tiposEstofadoCompativel.includes(tipoEstofado) ||
                                   produto.tiposEstofadoCompativel.length === 0;

              return (
                <button
                  key={produto.id}
                  onClick={() => isCompatible && toggleProduto(produto.id)}
                  disabled={!isCompatible}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500'
                      : isCompatible
                      ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{produto.nome}</p>
                      {produto.fabricante && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{produto.fabricante}</p>
                      )}
                    </div>
                    {!isCompatible && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Incompatível</span>
                    )}
                    {isSelected && (
                      <span className="text-primary-500 dark:text-primary-400 font-medium">✓ Selecionado</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleCalcular}
          disabled={produtosSelecionados.length === 0}
          className="btn-primary w-full"
        >
          Calcular
        </button>
      </div>
    </div>
  );
}
