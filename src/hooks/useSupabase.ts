import { useState, useEffect, useCallback } from 'react';
import type { Produto, Cliente, ResultadoCalculo } from '../types';
import {
  carregarProdutosSupabase,
  adicionarProdutoSupabase,
  atualizarProdutoSupabase,
  removerProdutoSupabase,
  carregarClientesSupabase,
  adicionarClienteSupabase,
  atualizarClienteSupabase,
  removerClienteSupabase,
  adicionarServicoSupabase,
  atualizarServicoSupabase,
  removerServicoSupabase,
  carregarHistoricoSupabase,
  adicionarAoHistoricoSupabase,
  removerDoHistoricoSupabase,
} from '../services/supabaseStorage';
import type { Servico } from '../types';

// Hook para Produtos
export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carregarProdutosSupabase();
      setProdutos(data);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (produto: Produto) => {
    const novoProduto = await adicionarProdutoSupabase(produto);
    if (novoProduto) {
      setProdutos((prev) => [...prev, novoProduto]);
      return true;
    }
    return false;
  };

  const atualizar = async (id: string, produto: Partial<Produto>) => {
    const success = await atualizarProdutoSupabase(id, produto);
    if (success) {
      await carregar();
    }
    return success;
  };

  const remover = async (id: string) => {
    const success = await removerProdutoSupabase(id);
    if (success) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    }
    return success;
  };

  return {
    produtos,
    loading,
    error,
    carregar,
    adicionar,
    atualizar,
    remover,
  };
}

// Hook para Clientes
export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carregarClientesSupabase();
      setClientes(data);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (cliente: Omit<Cliente, 'servicos'>) => {
    const novoCliente = await adicionarClienteSupabase(cliente);
    if (novoCliente) {
      setClientes((prev) => [...prev, novoCliente]);
      return true;
    }
    return false;
  };

  const atualizar = async (id: string, cliente: Partial<Cliente>) => {
    const success = await atualizarClienteSupabase(id, cliente);
    if (success) {
      await carregar();
    }
    return success;
  };

  const remover = async (id: string) => {
    const success = await removerClienteSupabase(id);
    if (success) {
      setClientes((prev) => prev.filter((c) => c.id !== id));
    }
    return success;
  };

  const adicionarServico = async (clienteId: string, servico: Servico) => {
    const success = await adicionarServicoSupabase(clienteId, servico);
    if (success) {
      await carregar();
    }
    return success;
  };

  const atualizarServico = async (servicoId: string, servico: Partial<Servico>) => {
    const success = await atualizarServicoSupabase(servicoId, servico);
    if (success) {
      await carregar();
    }
    return success;
  };

  const removerServico = async (servicoId: string) => {
    const success = await removerServicoSupabase(servicoId);
    if (success) {
      await carregar();
    }
    return success;
  };

  return {
    clientes,
    loading,
    error,
    carregar,
    adicionar,
    atualizar,
    remover,
    adicionarServico,
    atualizarServico,
    removerServico,
  };
}

// Hook para Histórico
export function useHistorico() {
  const [historico, setHistorico] = useState<ResultadoCalculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carregarHistoricoSupabase();
      setHistorico(data);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (resultado: ResultadoCalculo) => {
    const success = await adicionarAoHistoricoSupabase(resultado);
    if (success) {
      await carregar();
    }
    return success;
  };

  const remover = async (id: string) => {
    const success = await removerDoHistoricoSupabase(id);
    if (success) {
      setHistorico((prev) => prev.filter((h) => h.id !== id));
    }
    return success;
  };

  return {
    historico,
    loading,
    error,
    carregar,
    adicionar,
    remover,
  };
}
