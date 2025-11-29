-- =============================================
-- Mr Estofado Cálculos - Database Schema
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela de perfis de usuários (extende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  fabricante TEXT,
  diluicoes JSONB NOT NULL DEFAULT '[]',
  tipos_estofado_compativel TEXT[] DEFAULT '{}',
  unidade_medida TEXT NOT NULL DEFAULT 'ml' CHECK (unidade_medida IN ('ml', 'litros')),
  valor_pago DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantidade_embalagem DECIMAL(10,2) NOT NULL DEFAULT 0,
  custo_por_unidade DECIMAL(10,6) NOT NULL DEFAULT 0,
  rendimento_por_m2 DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  custo_produtos DECIMAL(10,2) NOT NULL DEFAULT 0,
  custo_mao_de_obra DECIMAL(10,2),
  preco_venda DECIMAL(10,2),
  lucro DECIMAL(10,2),
  data_servico DATE,
  calculo_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de cálculos
CREATE TABLE IF NOT EXISTS public.historico_calculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  input JSONB NOT NULL,
  area_total DECIMAL(10,4) NOT NULL,
  quantidade_solucao DECIMAL(10,4) NOT NULL,
  tempo_estimado INTEGER,
  resultados_produtos JSONB NOT NULL DEFAULT '[]',
  cliente_nome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_calculos ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Super admin pode fazer tudo em profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Políticas para produtos (todos usuários autenticados podem ver/editar)
CREATE POLICY "Usuários autenticados podem ver produtos" ON public.produtos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem inserir produtos" ON public.produtos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar produtos" ON public.produtos
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem deletar produtos" ON public.produtos
  FOR DELETE TO authenticated USING (true);

-- Políticas para clientes
CREATE POLICY "Usuários autenticados podem ver clientes" ON public.clientes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem inserir clientes" ON public.clientes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar clientes" ON public.clientes
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem deletar clientes" ON public.clientes
  FOR DELETE TO authenticated USING (true);

-- Políticas para serviços
CREATE POLICY "Usuários autenticados podem ver servicos" ON public.servicos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem inserir servicos" ON public.servicos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar servicos" ON public.servicos
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem deletar servicos" ON public.servicos
  FOR DELETE TO authenticated USING (true);

-- Políticas para histórico
CREATE POLICY "Usuários autenticados podem ver historico" ON public.historico_calculos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem inserir historico" ON public.historico_calculos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar historico" ON public.historico_calculos
  FOR DELETE TO authenticated USING (true);

-- =============================================
-- Triggers para atualizar updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Trigger para criar perfil automaticamente
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Índices para performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_servicos_cliente_id ON public.servicos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_servicos_data_servico ON public.servicos(data_servico);
CREATE INDEX IF NOT EXISTS idx_historico_created_at ON public.historico_calculos(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
