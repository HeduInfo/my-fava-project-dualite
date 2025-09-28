/*
# [Criação do Esquema Inicial do SySFava]
Este script estabelece a estrutura fundamental do banco de dados para o sistema SySFava, incluindo tabelas para perfis de usuário, finanças, ativos e veículos. Também configura a segurança de acesso aos dados (RLS) e um gatilho para sincronizar novos usuários.

## Query Description: [Este script cria novas tabelas e tipos de dados. Ele é seguro para ser executado em um banco de dados vazio, mas não deve ser executado em um ambiente com dados existentes sem um backup prévio, pois pode causar conflitos.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["High"]
- Requires-Backup: [true]
- Reversible: [false]

## Structure Details:
- Enums: user_role, account_type, transaction_type, asset_condition, vehicle_type, fuel_type
- Tables: profiles, accounts, transactions, assets, vehicles, refuelings, vehicle_maintenances
- Triggers: on_auth_user_created

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [JWT]

## Performance Impact:
- Indexes: [Primary Keys, Foreign Keys]
- Triggers: [1 on auth.users]
- Estimated Impact: [Baixo impacto inicial. O desempenho dependerá do volume de dados.]
*/

-- ========= ENUMS (TIPOS PERSONALIZADOS) =========

/*
# [Criação de Tipos Enum]
Define tipos de dados personalizados para padronizar valores em colunas específicas, como perfis de usuário, tipos de transação, etc.
*/
CREATE TYPE public.user_role AS ENUM ('Administrador', 'Lançador', 'Somente Leitura');
CREATE TYPE public.account_type AS ENUM ('Conta Corrente', 'Poupança', 'Investimento', 'Dinheiro', 'Outro');
CREATE TYPE public.transaction_type AS ENUM ('receita', 'despesa');
CREATE TYPE public.asset_condition AS ENUM ('Novo', 'Excelente', 'Bom', 'Regular', 'Ruim', 'Danificado');
CREATE TYPE public.vehicle_type AS ENUM ('car', 'motorcycle', 'truck', 'other');
CREATE TYPE public.fuel_type AS ENUM ('Gasolina', 'Etanol', 'Diesel', 'Flex', 'Elétrico', 'Gás', 'Outro');

-- ========= TABELA DE PERFIS (PROFILES) =========

/*
# [Criação da Tabela de Perfis]
Armazena informações adicionais dos usuários, vinculadas à tabela de autenticação do Supabase.
*/
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'Lançador'::public.user_role NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Tabela de perfis de usuário para dados adicionais.';
COMMENT ON COLUMN public.profiles.id IS 'Referência ao ID do usuário em auth.users.';

-- ========= TABELAS DO MÓDULO FINANCEIRO =========

/*
# [Criação das Tabelas Financeiras]
Define as tabelas para contas (bancárias, etc.) e transações (receitas/despesas).
*/
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type public.account_type NOT NULL,
  initial_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category TEXT,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========= TABELA DO MÓDULO DE ATIVOS =========

/*
# [Criação da Tabela de Ativos]
Define a tabela para o cadastro de bens patrimoniais.
*/
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  acquisition_value NUMERIC(15, 2),
  current_value NUMERIC(15, 2),
  acquisition_date DATE,
  location TEXT,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  warranty_expires_at DATE,
  condition public.asset_condition,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========= TABELAS DO MÓDULO DE VEÍCULOS =========

/*
# [Criação das Tabelas de Veículos]
Define tabelas para veículos, abastecimentos e manutenções.
*/
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INT,
  type public.vehicle_type,
  license_plate TEXT UNIQUE,
  renavam TEXT,
  chassis TEXT,
  odometer INT,
  fuel_type public.fuel_type,
  licensing_date DATE,
  insurance_renewal_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.refuelings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  odometer INT NOT NULL,
  liters NUMERIC(10, 3) NOT NULL,
  price_per_liter NUMERIC(10, 3) NOT NULL,
  total_cost NUMERIC(10, 2) NOT NULL,
  fuel_type public.fuel_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.vehicle_maintenances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  odometer INT,
  type TEXT NOT NULL,
  cost NUMERIC(10, 2),
  provider TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========= GATILHO PARA CRIAÇÃO DE PERFIL =========

/*
# [Criação de Gatilho de Perfil de Usuário]
Cria um gatilho que insere automaticamente um novo registro na tabela `profiles` sempre que um novo usuário é criado na tabela `auth.users` do Supabase.
*/
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========= POLÍTICAS DE SEGURANÇA (RLS) =========

/*
# [Configuração de RLS]
Ativa a Segurança em Nível de Linha (RLS) para todas as tabelas e cria políticas que garantem que os usuários só possam acessar e modificar seus próprios dados.
*/

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refuelings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_maintenances ENABLE ROW LEVEL SECURITY;

-- Políticas para `profiles`
CREATE POLICY "Usuários podem ver e atualizar seus próprios perfis"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- Políticas para `accounts`
CREATE POLICY "Usuários podem gerenciar suas próprias contas"
  ON public.accounts FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para `transactions`
CREATE POLICY "Usuários podem gerenciar suas próprias transações"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para `assets`
CREATE POLICY "Usuários podem gerenciar seus próprios ativos"
  ON public.assets FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para `vehicles`
CREATE POLICY "Usuários podem gerenciar seus próprios veículos"
  ON public.vehicles FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para `refuelings`
CREATE POLICY "Usuários podem gerenciar abastecimentos de seus veículos"
  ON public.refuelings FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para `vehicle_maintenances`
CREATE POLICY "Usuários podem gerenciar manutenções de seus veículos"
  ON public.vehicle_maintenances FOR ALL
  USING (auth.uid() = user_id);
