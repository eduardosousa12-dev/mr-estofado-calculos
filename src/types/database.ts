export type UserRole = 'super_admin' | 'admin' | 'user';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nome: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nome: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nome?: string;
          role?: UserRole;
          updated_at?: string;
        };
      };
      produtos: {
        Row: {
          id: string;
          nome: string;
          fabricante: string | null;
          diluicoes: {
            nivel: string;
            proporcao: string;
          }[];
          tipos_estofado_compativel: string[];
          unidade_medida: 'ml' | 'litros';
          valor_pago: number;
          quantidade_embalagem: number;
          custo_por_unidade: number;
          rendimento_por_m2: number;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          fabricante?: string | null;
          diluicoes: {
            nivel: string;
            proporcao: string;
          }[];
          tipos_estofado_compativel?: string[];
          unidade_medida?: 'ml' | 'litros';
          valor_pago: number;
          quantidade_embalagem: number;
          custo_por_unidade: number;
          rendimento_por_m2?: number;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nome?: string;
          fabricante?: string | null;
          diluicoes?: {
            nivel: string;
            proporcao: string;
          }[];
          tipos_estofado_compativel?: string[];
          unidade_medida?: 'ml' | 'litros';
          valor_pago?: number;
          quantidade_embalagem?: number;
          custo_por_unidade?: number;
          rendimento_por_m2?: number;
          observacoes?: string | null;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          nome: string;
          telefone: string | null;
          endereco: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          telefone?: string | null;
          endereco?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nome?: string;
          telefone?: string | null;
          endereco?: string | null;
          observacoes?: string | null;
          updated_at?: string;
        };
      };
      servicos: {
        Row: {
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
        };
        Insert: {
          id?: string;
          cliente_id: string;
          tipo: string;
          descricao: string;
          custo_produtos: number;
          custo_mao_de_obra?: number | null;
          preco_venda?: number | null;
          lucro?: number | null;
          data_servico?: string | null;
          calculo_id?: string | null;
          created_at?: string;
        };
        Update: {
          cliente_id?: string;
          tipo?: string;
          descricao?: string;
          custo_produtos?: number;
          custo_mao_de_obra?: number | null;
          preco_venda?: number | null;
          lucro?: number | null;
          data_servico?: string | null;
          calculo_id?: string | null;
        };
      };
      historico_calculos: {
        Row: {
          id: string;
          input: {
            tipoEstofado: string;
            dimensoes: {
              largura: number;
              comprimento: number;
              profundidade: number;
            };
            nivelSujidade: string;
            produtosSelecionados: string[];
          };
          area_total: number;
          quantidade_solucao: number;
          tempo_estimado: number | null;
          resultados_produtos: {
            produtoId: string;
            produtoNome: string;
            proporcao: string;
            quantidadeProduto: number;
            quantidadeAgua: number;
          }[];
          cliente_nome: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          input: {
            tipoEstofado: string;
            dimensoes: {
              largura: number;
              comprimento: number;
              profundidade: number;
            };
            nivelSujidade: string;
            produtosSelecionados: string[];
          };
          area_total: number;
          quantidade_solucao: number;
          tempo_estimado?: number | null;
          resultados_produtos: {
            produtoId: string;
            produtoNome: string;
            proporcao: string;
            quantidadeProduto: number;
            quantidadeAgua: number;
          }[];
          cliente_nome?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          input?: {
            tipoEstofado: string;
            dimensoes: {
              largura: number;
              comprimento: number;
              profundidade: number;
            };
            nivelSujidade: string;
            produtosSelecionados: string[];
          };
          area_total?: number;
          quantidade_solucao?: number;
          tempo_estimado?: number | null;
          resultados_produtos?: {
            produtoId: string;
            produtoNome: string;
            proporcao: string;
            quantidadeProduto: number;
            quantidadeAgua: number;
          }[];
          cliente_nome?: string | null;
        };
      };
    };
  };
}
