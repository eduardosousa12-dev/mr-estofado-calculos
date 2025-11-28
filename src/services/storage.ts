import { Produto, ResultadoCalculo, Servico, Cliente } from '../types';

const STORAGE_KEYS = {
  PRODUTOS: 'mr-estofado-produtos',
  HISTORICO: 'mr-estofado-historico',
  CLIENTES: 'mr-estofado-clientes',
} as const;

// Produtos
export function salvarProdutos(produtos: Produto[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
}

export function carregarProdutos(): Produto[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function adicionarProduto(produto: Produto): void {
  const produtos = carregarProdutos();
  produtos.push(produto);
  salvarProdutos(produtos);
}

export function atualizarProduto(produtoId: string, produtoAtualizado: Produto): void {
  const produtos = carregarProdutos();
  const index = produtos.findIndex(p => p.id === produtoId);
  if (index !== -1) {
    produtos[index] = produtoAtualizado;
    salvarProdutos(produtos);
  }
}

export function removerProduto(produtoId: string): void {
  const produtos = carregarProdutos();
  const produtosFiltrados = produtos.filter(p => p.id !== produtoId);
  salvarProdutos(produtosFiltrados);
}

// Histórico
export function salvarHistorico(historico: ResultadoCalculo[]): void {
  localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(historico));
}

export function carregarHistorico(): ResultadoCalculo[] {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORICO);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function adicionarAoHistorico(resultado: ResultadoCalculo): void {
  const historico = carregarHistorico();
  historico.unshift(resultado); // Adiciona no início
  salvarHistorico(historico);
}

export function removerDoHistorico(resultadoId: string): void {
  const historico = carregarHistorico();
  const historicoFiltrado = historico.filter(h => h.id !== resultadoId);
  salvarHistorico(historicoFiltrado);
}

// Clientes
export function salvarClientes(clientes: Cliente[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
}

export function carregarClientes(): Cliente[] {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function adicionarCliente(cliente: Cliente): void {
  const clientes = carregarClientes();
  clientes.push(cliente);
  salvarClientes(clientes);
}

export function atualizarCliente(clienteId: string, clienteAtualizado: Cliente): void {
  const clientes = carregarClientes();
  const index = clientes.findIndex(c => c.id === clienteId);
  if (index !== -1) {
    clientes[index] = clienteAtualizado;
    salvarClientes(clientes);
  }
}

export function removerCliente(clienteId: string): void {
  const clientes = carregarClientes();
  const clientesFiltrados = clientes.filter(c => c.id !== clienteId);
  salvarClientes(clientesFiltrados);
}

export function adicionarServicoAoCliente(clienteId: string, servico: Servico): void {
  const clientes = carregarClientes();
  const cliente = clientes.find(c => c.id === clienteId);
  if (cliente) {
    cliente.servicos.push(servico);
    cliente.updatedAt = new Date().toISOString();
    salvarClientes(clientes);
  }
}

export function atualizarServicoDoCliente(clienteId: string, servicoId: string, servicoAtualizado: Servico): void {
  const clientes = carregarClientes();
  const cliente = clientes.find(c => c.id === clienteId);
  if (cliente) {
    const index = cliente.servicos.findIndex(s => s.id === servicoId);
    if (index !== -1) {
      cliente.servicos[index] = servicoAtualizado;
      cliente.updatedAt = new Date().toISOString();
      salvarClientes(clientes);
    }
  }
}

export function removerServicoDoCliente(clienteId: string, servicoId: string): void {
  const clientes = carregarClientes();
  const cliente = clientes.find(c => c.id === clienteId);
  if (cliente) {
    cliente.servicos = cliente.servicos.filter(s => s.id !== servicoId);
    cliente.updatedAt = new Date().toISOString();
    salvarClientes(clientes);
  }
}

