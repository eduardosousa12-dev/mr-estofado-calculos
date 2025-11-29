import { supabase } from '../lib/supabase';
import type { Produto, Cliente, Servico, ResultadoCalculo } from '../types';

// Interface para representar os dados do banco
interface ProdutoDB {
  id: string;
  nome: string;
  fabricante: string | null;
  diluicoes: Produto['diluicoes'];
  tipos_estofado_compativel: string[] | null;
  unidade_medida: string;
  valor_pago: number;
  quantidade_embalagem: number;
  custo_por_unidade: number;
  rendimento_por_m2: number | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

interface ClienteDB {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

interface ServicoDB {
  id: string;
  cliente_id: string;
  tipo: string;
  descricao: string;
  custo_produtos: number;
  custo_mao_de_obra: number | null;
  preco_venda: number | null;
  lucro: number | null;
  data_servico: string | null;
  calculo_id: string | null;
  created_at: string;
}

interface HistoricoDB {
  id: string;
  input: ResultadoCalculo['input'];
  area_total: number;
  quantidade_solucao: number;
  tempo_estimado: number | null;
  resultados_produtos: ResultadoCalculo['resultadosProdutos'];
  cliente_nome: string | null;
  created_at: string;
  created_by: string | null;
}

// =============================================
// PRODUTOS
// =============================================

export async function carregarProdutosSupabase(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }

  return (data as ProdutoDB[]).map((p) => ({
    id: p.id,
    nome: p.nome,
    fabricante: p.fabricante || undefined,
    diluicoes: p.diluicoes,
    tiposEstofadoCompativel: (p.tipos_estofado_compativel || []) as Produto['tiposEstofadoCompativel'],
    unidadeMedida: p.unidade_medida as 'ml' | 'litros',
    valorPago: Number(p.valor_pago),
    quantidadeEmbalagem: Number(p.quantidade_embalagem),
    custoPorUnidade: Number(p.custo_por_unidade),
    rendimentoPorM2: Number(p.rendimento_por_m2) || 0,
    observacoes: p.observacoes || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

export async function adicionarProdutoSupabase(produto: Produto): Promise<Produto | null> {
  const insertData = {
    nome: produto.nome,
    fabricante: produto.fabricante || null,
    diluicoes: produto.diluicoes,
    tipos_estofado_compativel: produto.tiposEstofadoCompativel,
    unidade_medida: produto.unidadeMedida,
    valor_pago: produto.valorPago,
    quantidade_embalagem: produto.quantidadeEmbalagem,
    custo_por_unidade: produto.custoPorUnidade,
    rendimento_por_m2: produto.rendimentoPorM2 || 0,
    observacoes: produto.observacoes || null,
  };

  const { data, error } = await supabase
    .from('produtos')
    .insert(insertData as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar produto:', error);
    return null;
  }

  const p = data as ProdutoDB;
  return {
    id: p.id,
    nome: p.nome,
    fabricante: p.fabricante || undefined,
    diluicoes: p.diluicoes,
    tiposEstofadoCompativel: (p.tipos_estofado_compativel || []) as Produto['tiposEstofadoCompativel'],
    unidadeMedida: p.unidade_medida as 'ml' | 'litros',
    valorPago: Number(p.valor_pago),
    quantidadeEmbalagem: Number(p.quantidade_embalagem),
    custoPorUnidade: Number(p.custo_por_unidade),
    rendimentoPorM2: Number(p.rendimento_por_m2) || 0,
    observacoes: p.observacoes || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export async function atualizarProdutoSupabase(id: string, produto: Partial<Produto>): Promise<boolean> {
  const updateData = {
    nome: produto.nome,
    fabricante: produto.fabricante || null,
    diluicoes: produto.diluicoes,
    tipos_estofado_compativel: produto.tiposEstofadoCompativel,
    unidade_medida: produto.unidadeMedida,
    valor_pago: produto.valorPago,
    quantidade_embalagem: produto.quantidadeEmbalagem,
    custo_por_unidade: produto.custoPorUnidade,
    rendimento_por_m2: produto.rendimentoPorM2 || 0,
    observacoes: produto.observacoes || null,
  };

  const { error } = await supabase
    .from('produtos')
    .update(updateData as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar produto:', error);
    return false;
  }

  return true;
}

export async function removerProdutoSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao remover produto:', error);
    return false;
  }

  return true;
}

// =============================================
// CLIENTES
// =============================================

export async function carregarClientesSupabase(): Promise<Cliente[]> {
  const { data: clientesData, error: clientesError } = await supabase
    .from('clientes')
    .select('*')
    .order('nome');

  if (clientesError) {
    console.error('Erro ao carregar clientes:', clientesError);
    return [];
  }

  const { data: servicosData, error: servicosError } = await supabase
    .from('servicos')
    .select('*')
    .order('created_at', { ascending: false });

  if (servicosError) {
    console.error('Erro ao carregar serviços:', servicosError);
  }

  const servicos = (servicosData || []) as ServicoDB[];
  const clientes = clientesData as ClienteDB[];

  return clientes.map((c) => ({
    id: c.id,
    nome: c.nome,
    telefone: c.telefone || undefined,
    endereco: c.endereco || undefined,
    observacoes: c.observacoes || undefined,
    servicos: servicos
      .filter((s) => s.cliente_id === c.id)
      .map((s) => ({
        id: s.id,
        tipo: s.tipo as Servico['tipo'],
        descricao: s.descricao,
        custoProdutos: Number(s.custo_produtos),
        custoMaoDeObra: s.custo_mao_de_obra ? Number(s.custo_mao_de_obra) : undefined,
        precoVenda: s.preco_venda ? Number(s.preco_venda) : undefined,
        lucro: s.lucro ? Number(s.lucro) : undefined,
        dataServico: s.data_servico || undefined,
        calculoId: s.calculo_id || undefined,
        createdAt: s.created_at,
      })),
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

export async function adicionarClienteSupabase(cliente: Omit<Cliente, 'servicos'>): Promise<Cliente | null> {
  const insertData = {
    nome: cliente.nome,
    telefone: cliente.telefone || null,
    endereco: cliente.endereco || null,
    observacoes: cliente.observacoes || null,
  };

  const { data, error } = await supabase
    .from('clientes')
    .insert(insertData as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar cliente:', error);
    return null;
  }

  const c = data as ClienteDB;
  return {
    id: c.id,
    nome: c.nome,
    telefone: c.telefone || undefined,
    endereco: c.endereco || undefined,
    observacoes: c.observacoes || undefined,
    servicos: [],
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

export async function atualizarClienteSupabase(id: string, cliente: Partial<Cliente>): Promise<boolean> {
  const updateData = {
    nome: cliente.nome,
    telefone: cliente.telefone || null,
    endereco: cliente.endereco || null,
    observacoes: cliente.observacoes || null,
  };

  const { error } = await supabase
    .from('clientes')
    .update(updateData as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar cliente:', error);
    return false;
  }

  return true;
}

export async function removerClienteSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao remover cliente:', error);
    return false;
  }

  return true;
}

// =============================================
// SERVIÇOS
// =============================================

export async function adicionarServicoSupabase(clienteId: string, servico: Servico): Promise<boolean> {
  const insertData = {
    cliente_id: clienteId,
    tipo: servico.tipo,
    descricao: servico.descricao,
    custo_produtos: servico.custoProdutos,
    custo_mao_de_obra: servico.custoMaoDeObra || null,
    preco_venda: servico.precoVenda || null,
    lucro: servico.lucro || null,
    data_servico: servico.dataServico || null,
    calculo_id: servico.calculoId || null,
  };

  const { error } = await supabase
    .from('servicos')
    .insert(insertData as Record<string, unknown>);

  if (error) {
    console.error('Erro ao adicionar serviço:', error);
    return false;
  }

  return true;
}

export async function atualizarServicoSupabase(id: string, servico: Partial<Servico>): Promise<boolean> {
  const updateData = {
    tipo: servico.tipo,
    descricao: servico.descricao,
    custo_produtos: servico.custoProdutos,
    custo_mao_de_obra: servico.custoMaoDeObra || null,
    preco_venda: servico.precoVenda || null,
    lucro: servico.lucro || null,
    data_servico: servico.dataServico || null,
  };

  const { error } = await supabase
    .from('servicos')
    .update(updateData as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar serviço:', error);
    return false;
  }

  return true;
}

export async function removerServicoSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('servicos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao remover serviço:', error);
    return false;
  }

  return true;
}

// =============================================
// HISTÓRICO
// =============================================

export async function carregarHistoricoSupabase(): Promise<ResultadoCalculo[]> {
  const { data, error } = await supabase
    .from('historico_calculos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }

  return (data as HistoricoDB[]).map((h) => ({
    id: h.id,
    input: h.input,
    areaTotal: Number(h.area_total),
    quantidadeSolucao: Number(h.quantidade_solucao),
    tempoEstimado: h.tempo_estimado || undefined,
    resultadosProdutos: h.resultados_produtos,
    clienteNome: h.cliente_nome || undefined,
    createdAt: h.created_at,
  }));
}

export async function adicionarAoHistoricoSupabase(resultado: ResultadoCalculo): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();

  const insertData = {
    input: resultado.input,
    area_total: resultado.areaTotal,
    quantidade_solucao: resultado.quantidadeSolucao,
    tempo_estimado: resultado.tempoEstimado || null,
    resultados_produtos: resultado.resultadosProdutos,
    cliente_nome: resultado.clienteNome || null,
    created_by: user?.id || null,
  };

  const { error } = await supabase
    .from('historico_calculos')
    .insert(insertData as Record<string, unknown>);

  if (error) {
    console.error('Erro ao adicionar ao histórico:', error);
    return false;
  }

  return true;
}

export async function removerDoHistoricoSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('historico_calculos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao remover do histórico:', error);
    return false;
  }

  return true;
}
