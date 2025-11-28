import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Clock, Ruler, Droplet, User } from 'lucide-react';
import { ResultadoCalculo, Servico } from '../types';
import { TIPOS_ESTOFADO_LABELS, NIVEL_SUJIDADE_LABELS } from '../constants/presets';
import { adicionarAoHistorico, carregarHistorico, carregarClientes, adicionarServicoAoCliente, carregarProdutos } from '../services/storage';

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado as ResultadoCalculo | undefined;
  const clientes = carregarClientes();
  const produtos = carregarProdutos();

  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');

  if (!resultado) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 dark:text-gray-400">Nenhum resultado encontrado</p>
        <button onClick={() => navigate('/calculadora')} className="btn-primary mt-4">
          Fazer Novo Cálculo
        </button>
      </div>
    );
  }

  // Calcula o custo total dos produtos usados
  const calcularCustoProdutos = () => {
    let custoTotal = 0;
    resultado.resultadosProdutos.forEach(rp => {
      const produto = produtos.find(p => p.id === rp.produtoId);
      if (produto) {
        // Custo = quantidade de produto (ml) × custo por ml
        custoTotal += rp.quantidadeProduto * produto.custoPorUnidade;
      }
    });
    return custoTotal;
  };

  const handleSalvar = () => {
    const historico = carregarHistorico();
    const jaExiste = historico.some(h => h.id === resultado.id);

    if (!jaExiste) {
      adicionarAoHistorico(resultado);
    }

    // Se um cliente foi selecionado, criar um serviço para ele
    if (clienteSelecionado) {
      const novoServico: Servico = {
        id: crypto.randomUUID(),
        tipo: resultado.input.tipoEstofado.startsWith('colchao') ? 'colchao' : 'sofa',
        descricao: `${TIPOS_ESTOFADO_LABELS[resultado.input.tipoEstofado]} - ${NIVEL_SUJIDADE_LABELS[resultado.input.nivelSujidade]}`,
        custoProdutos: calcularCustoProdutos(),
        calculoId: resultado.id,
        createdAt: new Date().toISOString(),
      };

      adicionarServicoAoCliente(clienteSelecionado, novoServico);
      const clienteNome = clientes.find(c => c.id === clienteSelecionado)?.nome;
      alert(`Cálculo salvo e vinculado ao cliente "${clienteNome}"!`);
    } else {
      alert('Cálculo salvo no histórico!');
    }
  };

  const formatarML = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(2)} L`;
    }
    return `${ml.toFixed(0)} ml`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Resultado do Cálculo</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            {new Date(resultado.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/calculadora')} className="btn-secondary text-sm">
            <ArrowLeft size={16} className="inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Novo Cálculo</span>
            <span className="sm:hidden">Novo</span>
          </button>
          <button onClick={handleSalvar} className="btn-primary text-sm">
            <Save size={16} className="inline mr-1 sm:mr-2" />
            Salvar
          </button>
        </div>
      </div>

      {/* Informações do Estofado */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Informações do Estofado
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {TIPOS_ESTOFADO_LABELS[resultado.input.tipoEstofado]}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Nível de Sujidade</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {NIVEL_SUJIDADE_LABELS[resultado.input.nivelSujidade]}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dimensões</p>
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              <div>Largura: {resultado.input.dimensoes.largura} cm</div>
              <div>Comprimento: {resultado.input.dimensoes.comprimento} cm</div>
              <div>
                {resultado.input.tipoEstofado.startsWith('colchao') ? 'Altura' : 'Altura (Encosto)'}: {resultado.input.dimensoes.profundidade} cm
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Área Total</p>
            <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <Ruler size={16} />
              {resultado.areaTotal} m²
            </p>
          </div>
        </div>
      </div>

      {/* Resumo da Solução */}
      <div className="card p-4 sm:p-6 bg-primary-50 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Droplet className="text-primary-500 dark:text-primary-400" size={20} />
          <h3 className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
            Quantidade Total de Solução
          </h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-primary-500 dark:text-primary-400">
          {resultado.quantidadeSolucao.toFixed(2)} litros
        </p>
        {resultado.tempoEstimado && (
          <div className="mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Clock size={16} />
            <span className="text-sm">
              Tempo estimado: {resultado.tempoEstimado} minutos
            </span>
          </div>
        )}
      </div>

      {/* Resultados por Produto */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Diluição por Produto
        </h3>
        <div className="space-y-4">
          {resultado.resultadosProdutos.map((produto) => (
            <div
              key={produto.produtoId}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{produto.produtoNome}</h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Proporção: {produto.proporcao}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Produto Concentrado</p>
                  <p className="text-xl font-bold text-primary-500 dark:text-primary-400">
                    {formatarML(produto.quantidadeProduto)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Água</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatarML(produto.quantidadeAgua)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vincular a Cliente */}
      {clientes.length > 0 && (
        <div className="card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-gray-600 dark:text-gray-400" size={20} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Vincular a Cliente
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Selecione um cliente para vincular este cálculo como um serviço
          </p>
          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            className="input-field"
          >
            <option value="">Não vincular a nenhum cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} {cliente.telefone ? `- ${cliente.telefone}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Instruções */}
      <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
          Dica
        </h4>
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          Meça cuidadosamente as quantidades de produto e água. Misture bem antes de aplicar.
          Sempre teste em uma área pequena primeiro.
        </p>
      </div>
    </div>
  );
}
