import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
} from 'lucide-react';
import StatCard from '../StatCard';
import { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface FinancialStatsProps {
  transactions: Transaction[];
}

const FinancialStats: React.FC<FinancialStatsProps> = ({ transactions }) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const stats = [
    {
      title: 'Saldo do Mês',
      value: `R$ ${balance.toFixed(2)}`,
      change: '',
      changeType: 'neutral' as const,
      icon: DollarSign
    },
    {
      title: 'Receitas',
      value: `R$ ${income.toFixed(2)}`,
      change: '',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Despesas',
      value: `R$ ${expenses.toFixed(2)}`,
      change: '',
      changeType: 'negative' as const,
      icon: TrendingDown
    },
    {
      title: 'Meta Mensal',
      value: 'N/A',
      change: '',
      changeType: 'neutral' as const,
      icon: Target
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default FinancialStats;
