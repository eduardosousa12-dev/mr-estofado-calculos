import { useState } from 'react';
import { Plus, Trash2, Edit, User, Phone, MapPin, Mail, Calendar, Package, Loader2 } from 'lucide-react';
import { Cliente, Servico } from '../types';
import { TIPOS_SERVICO_LABELS } from '../constants/servicos';
import { useClientes } from '../hooks/useSupabase';
import { calcularCustoProdutos, calcularLucro } from '../utils/custos';
import ModalCliente from '../components/ModalCliente';
import ModalServicoCliente from '../components/ModalServicoCliente';
import ModalComboServicos from '../components/ModalComboServicos';

export default function Clientes() {
  const { clientes, loading, error, adicionar, atualizar, remover, adicionarServico, atualizarServico, removerServico } = useClientes();
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [modalServicoAberto, setModalServicoAberto] = useState(false);
  const [modalComboAberto, setModalComboAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [servicoEditando, setServicoEditando] = useState<{ clienteId: string; servico: Servico | null } | null>(null);
  const [clienteComboId, setClienteComboId] = useState<string | null>(null);

  const handleSalvarCliente = async (cliente: Cliente) => {
    if (clienteEditando) {
      await atualizar(clienteEditando.id, cliente);
    } else {
      await adicionar(cliente);
    }
    setModalClienteAberto(false);
    setClienteEditando(null);
  };

  const handleSalvarServico = async (servico: Servico) => {
    if (!servicoEditando) return;

    // Calcular custo automaticamente se tiver cálculo associado
    if (servico.calculoId) {
      servico.custoProdutos = calcularCustoProdutos(servico.calculoId);
    }

    // Calcular lucro
    servico.lucro = calcularLucro(servico);

    if (servicoEditando.servico) {
      await atualizarServico(servicoEditando.servico.id, servico);
    } else {
      await adicionarServico(servicoEditando.clienteId, servico);
    }

    setModalServicoAberto(false);
    setServicoEditando(null);
  };

  const handleRemoverCliente = async (clienteId: string) => {
    if (confirm('Tem certeza que deseja remover este cliente e todos os seus serviços?')) {
      await remover(clienteId);
    }
  };

  const handleRemoverServico = async (_clienteId: string, servicoId: string) => {
    if (confirm('Tem certeza que deseja remover este serviço?')) {
      await removerServico(servicoId);
    }
  };

  const handleNovoCliente = () => {
    setClienteEditando(null);
    setModalClienteAberto(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalClienteAberto(true);
  };

  const handleNovoServico = (clienteId: string) => {
    setServicoEditando({ clienteId, servico: null });
    setModalServicoAberto(true);
  };

  const handleEditarServico = (clienteId: string, servico: Servico) => {
    setServicoEditando({ clienteId, servico });
    setModalServicoAberto(true);
  };

  const handleNovoCombo = (clienteId: string) => {
    setClienteComboId(clienteId);
    setModalComboAberto(true);
  };

  const handleSalvarCombo = async (servicos: Servico[]) => {
    if (!clienteComboId) return;

    // Adicionar cada serviço ao cliente
    for (const servico of servicos) {
      // Calcular custo automaticamente se tiver cálculo associado
      if (servico.calculoId) {
        servico.custoProdutos = calcularCustoProdutos(servico.calculoId);
      }
      // Calcular lucro
      servico.lucro = calcularLucro(servico);
      await adicionarServico(clienteComboId, servico);
    }

    setModalComboAberto(false);
    setClienteComboId(null);
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

  const calcularTotaisCliente = (cliente: Cliente) => {
    const custoTotal = cliente.servicos.reduce((sum, s) => sum + s.custoProdutos + (s.custoMaoDeObra || 0), 0);
    const receitaTotal = cliente.servicos.reduce((sum, s) => sum + (s.precoVenda || 0), 0);
    const lucroTotal = receitaTotal - custoTotal;
    return { custoTotal, receitaTotal, lucroTotal };
  };

  const getUltimoServico = (cliente: Cliente): string | null => {
    if (cliente.servicos.length === 0) return null;
    // Ordenar por data do serviço ou data de criação
    const servicosOrdenados = [...cliente.servicos].sort((a, b) => {
      const dataA = a.dataServico || a.createdAt;
      const dataB = b.dataServico || b.createdAt;
      return new Date(dataB).getTime() - new Date(dataA).getTime();
    });
    return servicosOrdenados[0].dataServico || servicosOrdenados[0].createdAt;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Clientes</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Gerencie clientes e seus serviços
          </p>
        </div>
        <button onClick={handleNovoCliente} className="btn-primary text-sm sm:text-base">
          <Plus size={18} className="inline mr-2" />
          Novo Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="card text-center py-8 sm:py-12 px-4">
          <User className="mx-auto text-gray-400 dark:text-gray-500" size={40} />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mt-3 sm:mt-4">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Cadastre clientes e adicione serviços a eles
          </p>
          <button onClick={handleNovoCliente} className="btn-primary mt-4">
            Cadastrar Primeiro Cliente
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {clientes.map((cliente) => {
            const totais = calcularTotaisCliente(cliente);
            const ultimoServico = getUltimoServico(cliente);
            return (
              <div key={cliente.id} className="card p-4 sm:p-6">
                {/* Cabeçalho do Cliente */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="text-primary-500 dark:text-primary-400" size={20} />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{cliente.nome}</h3>
                      {ultimoServico && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium flex items-center gap-1">
                          <Calendar size={12} />
                          Último: {formatarData(ultimoServico)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {cliente.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <span>{cliente.telefone}</span>
                        </div>
                      )}
                      {cliente.endereco && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{cliente.endereco}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleNovoServico(cliente.id)}
                      className="btn-primary text-sm"
                    >
                      <Plus size={16} className="inline mr-1" />
                      Serviço
                    </button>
                    <button
                      onClick={() => handleNovoCombo(cliente.id)}
                      className="btn-secondary text-sm"
                    >
                      <Package size={16} className="inline mr-1" />
                      Combo
                    </button>
                    <button
                      onClick={() => handleEditarCliente(cliente)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleRemoverCliente(cliente.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Resumo Financeiro do Cliente */}
                {cliente.servicos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Custo Total</p>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        R$ {totais.custoTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Receita Total</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        R$ {totais.receitaTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Lucro Total</p>
                      <p className={`text-sm font-semibold ${
                        totais.lucroTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        R$ {totais.lucroTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Lista de Serviços */}
                {cliente.servicos.length > 0 ? (
                  <div className="space-y-3">
                    {cliente.servicos.map((servico) => (
                      <div key={servico.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs rounded font-medium">
                                {TIPOS_SERVICO_LABELS[servico.tipo]}
                              </span>
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded font-medium flex items-center gap-1">
                                <Calendar size={12} />
                                {formatarData(servico.dataServico || servico.createdAt)}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{servico.descricao}</h4>
                            {servico.observacoes && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{servico.observacoes}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditarServico(cliente.id, servico)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoverServico(cliente.id, servico.id)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Custo Produtos</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              R$ {servico.custoProdutos.toFixed(2)}
                            </p>
                          </div>
                          {servico.custoMaoDeObra !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Mão de Obra</p>
                              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                R$ {servico.custoMaoDeObra.toFixed(2)}
                              </p>
                            </div>
                          )}
                          {servico.precoVenda !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Preço Venda</p>
                              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                R$ {servico.precoVenda.toFixed(2)}
                              </p>
                            </div>
                          )}
                          {servico.lucro !== undefined && (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Lucro</p>
                              <p className={`text-xs font-semibold ${
                                servico.lucro >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                R$ {servico.lucro.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    Nenhum serviço cadastrado. Clique em "Serviço" para adicionar.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalClienteAberto && (
        <ModalCliente
          cliente={clienteEditando}
          onSalvar={handleSalvarCliente}
          onFechar={() => {
            setModalClienteAberto(false);
            setClienteEditando(null);
          }}
        />
      )}

      {modalServicoAberto && servicoEditando && (
        <ModalServicoCliente
          servico={servicoEditando.servico}
          clienteId={servicoEditando.clienteId}
          onSalvar={handleSalvarServico}
          onFechar={() => {
            setModalServicoAberto(false);
            setServicoEditando(null);
          }}
        />
      )}

      {modalComboAberto && clienteComboId && (
        <ModalComboServicos
          clienteId={clienteComboId}
          onSalvar={handleSalvarCombo}
          onFechar={() => {
            setModalComboAberto(false);
            setClienteComboId(null);
          }}
        />
      )}
    </div>
  );
}

