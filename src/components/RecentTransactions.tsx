import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Car, Home, Utensils, Briefcase, Gamepad2, Heart, BookOpen } from 'lucide-react';
import { Database } from '../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Alimentação': <Utensils className="text-orange-500" size={16} />,
      'Transporte': <Car className="text-blue-500" size={16} />,
      'Moradia': <Home className="text-purple-500" size={16} />,
      'Compras': <ShoppingCart className="text-pink-500" size={16} />,
      'Saúde': <Heart className="text-red-500" size={16} />,
      'Educação': <BookOpen className="text-indigo-500" size={16} />,
      'Lazer': <Gamepad2 className="text-green-500" size={16} />,
      'Salário': <Briefcase className="text-green-500" size={16} />,
      'Freelance': <Briefcase className="text-blue-500" size={16} />
    };
    
    if (iconMap[category]) return iconMap[category];
    
    const isIncome = transactions.find(t => t.category === category)?.type === 'income';
    return isIncome ? <ArrowUpRight className="text-green-500" size={16} /> : <ArrowDownLeft className="text-red-500" size={16} />;
  };

  const recentTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Transações Recentes
      </h3>
      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  R$ {Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma transação recente.</p>
        )}
      </div>
      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
        Ver todas as transações
      </button>
    </motion.div>
  );
};

export default RecentTransactions;
