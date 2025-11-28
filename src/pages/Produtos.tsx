import { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Produto } from '../types';
import { carregarProdutos, adicionarProduto, atualizarProduto, removerProduto } from '../services/storage';
import { TIPOS_ESTOFADO_LABELS, NIVEL_SUJIDADE_LABELS } from '../constants/presets';
import ModalProduto from '../components/ModalProduto';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(carregarProdutos());
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const handleSalvar = (produto: Produto) => {
    if (produtoEditando) {
      atualizarProduto(produtoEditando.id, produto);
    } else {
      adicionarProduto(produto);
    }
    setProdutos(carregarProdutos());
    setModalAberto(false);
    setProdutoEditando(null);
  };

  const handleEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setModalAberto(true);
  };

  const handleRemover = (produtoId: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      removerProduto(produtoId);
      setProdutos(carregarProdutos());
    }
  };

  const handleNovo = () => {
    setProdutoEditando(null);
    setModalAberto(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Produtos</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Gerencie seus produtos químicos e suas diluições
          </p>
        </div>
        <button onClick={handleNovo} className="btn-primary text-sm sm:text-base">
          <Plus size={18} className="inline mr-2" />
          Novo Produto
        </button>
      </div>

      {produtos.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="mx-auto text-gray-400 dark:text-gray-500" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Nenhum produto cadastrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comece cadastrando seu primeiro produto químico
          </p>
          <button onClick={handleNovo} className="btn-primary mt-4">
            Cadastrar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="card p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {produto.nome}
                  </h3>
                  {produto.fabricante && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{produto.fabricante}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(produto)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleRemover(produto.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Diluições</p>
                  <div className="flex flex-wrap gap-2">
                    {produto.diluicoes.map((diluicao) => (
                      <span
                        key={diluicao.nivel}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {NIVEL_SUJIDADE_LABELS[diluicao.nivel]}: {diluicao.proporcao}
                      </span>
                    ))}
                  </div>
                </div>

                {produto.tiposEstofadoCompativel.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Compatível com</p>
                    <div className="flex flex-wrap gap-2">
                      {produto.tiposEstofadoCompativel.slice(0, 3).map((tipo) => (
                        <span
                          key={tipo}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                        >
                          {TIPOS_ESTOFADO_LABELS[tipo]}
                        </span>
                      ))}
                      {produto.tiposEstofadoCompativel.length > 3 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                          +{produto.tiposEstofadoCompativel.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {produto.observacoes && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Observações</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{produto.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <ModalProduto
          produto={produtoEditando}
          onSalvar={handleSalvar}
          onFechar={() => {
            setModalAberto(false);
            setProdutoEditando(null);
          }}
        />
      )}
    </div>
  );
}
