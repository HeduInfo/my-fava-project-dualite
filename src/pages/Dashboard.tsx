import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Loader2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import RecentTransactions from '../components/RecentTransactions';
import QuickActions from '../components/QuickActions';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    assetsValue: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      setLoading(true);

      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      // Fetch transactions for the current month
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', firstDay);

      // Fetch assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('current_value')
        .eq('user_id', session.user.id);
      
      if (transactionsData) {
        const income = transactionsData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactionsData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        setStats(prev => ({
          ...prev,
          income,
          expenses,
          balance: income - expenses,
        }));
        setTransactions(transactionsData);
      }

      if (assetsData) {
        const assetsValue = assetsData.reduce((sum, a) => sum + (a.current_value || 0), 0);
        setStats(prev => ({ ...prev, assetsValue }));
      }

      setLoading(false);
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral da sua situação financeira e patrimonial
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo (Mês)"
          value={`R$ ${stats.balance.toFixed(2)}`}
          change=""
          changeType="neutral"
          icon={DollarSign}
        />
        <StatCard
          title="Receitas (Mês)"
          value={`R$ ${stats.income.toFixed(2)}`}
          change=""
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Despesas (Mês)"
          value={`R$ ${stats.expenses.toFixed(2)}`}
          change=""
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Total Ativos"
          value={`R$ ${stats.assetsValue.toFixed(2)}`}
          change=""
          changeType="neutral"
          icon={Package}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard
            title="Fluxo de Caixa (Últimos 6 meses)"
            type="line"
          />
          <ChartCard
            title="Despesas por Categoria"
            type="pie"
            data={transactions.filter(t => t.type === 'expense')}
          />
        </div>
        <div className="space-y-6">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
