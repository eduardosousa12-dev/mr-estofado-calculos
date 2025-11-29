export type NivelSujidade = 'leve' | 'moderado' | 'pesado' | 'extremo';

export type TipoEstofado = 
  | 'sofa-2-lugares'
  | 'sofa-3-lugares'
  | 'sofa-l'
  | 'sofa-retratil'
  | 'colchao-solteiro'
  | 'colchao-casal'
  | 'colchao-queen'
  | 'colchao-king'
  | 'poltrona'
  | 'cadeira-estofada'
  | 'puff'
  | 'cabeceira'
  | 'banco-carro'
  | 'outro';

export interface Diluicao {
  nivel: NivelSujidade;
  proporcao: string; // formato "1:20" (produto:agua)
}

export interface Produto {
  id: string;
  nome: string;
  fabricante?: string;
  diluicoes: Diluicao[];
  tiposEstofadoCompativel: TipoEstofado[];
  unidadeMedida: 'ml' | 'litros';
  valorPago: number; // Valor pago pelo produto (R$)
  quantidadeEmbalagem: number; // Quantidade na embalagem (ml ou litros)
  custoPorUnidade: number; // Custo por ml ou litro (calculado automaticamente)
  rendimentoPorM2: number; // ml de solução diluída por m² (recomendado pelo fabricante)
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DimensoesEstofado {
  largura: number; // cm
  comprimento: number; // cm
  profundidade: number; // cm (altura para colchões)
}

export interface PresetEstofado {
  tipo: TipoEstofado;
  nome: string;
  dimensoes: DimensoesEstofado;
}

export interface CalculoInput {
  tipoEstofado: TipoEstofado;
  dimensoes: DimensoesEstofado;
  nivelSujidade: NivelSujidade;
  produtosSelecionados: string[]; // IDs dos produtos
}

export interface ResultadoProduto {
  produtoId: string;
  produtoNome: string;
  quantidadeProduto: number; // ml
  quantidadeAgua: number; // ml
  proporcao: string;
}

export interface ResultadoCalculo {
  id: string;
  input: CalculoInput;
  areaTotal: number; // m²
  quantidadeSolucao: number; // litros
  resultadosProdutos: ResultadoProduto[];
  tempoEstimado?: number; // minutos
  createdAt: string;
  clienteNome?: string;
}

export interface FatoresConsumo {
  leve: number;
  moderado: number;
  pesado: number;
  extremo: number;
}

export type TipoServico = 
  | 'higienizacao'
  | 'impermeabilizacao'
  | 'colchao'
  | 'sofa'
  | 'poltrona'
  | 'cadeira'
  | 'puff'
  | 'outro';

export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  endereco?: string;
  email?: string;
  observacoes?: string;
  servicos: Servico[];
  createdAt: string;
  updatedAt: string;
}

export interface Servico {
  id: string;
  tipo: TipoServico;
  descricao: string;
  observacoes?: string;
  custoProdutos: number; // Custo dos produtos calculado automaticamente
  custoMaoDeObra?: number; // Custo da mão de obra (manual)
  precoVenda?: number; // Preço de venda ao cliente
  lucro?: number; // Lucro calculado
  calculoId?: string; // ID do cálculo associado (opcional)
  dataServico?: string; // Data agendada do serviço
  createdAt: string;
}

