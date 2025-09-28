import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical,
  Edit,
  Trash2,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Heart,
  BookOpen,
  Gamepad2,
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; index: number }> = ({ transaction, onEdit, onDelete, index }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryIcon = (category: string, type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Alimentação': <Utensils className="text-orange-500" size={16} />,
      'Transporte': <Car className="text-blue-500" size={16} />,
      'Moradia': <Home className="text-purple-500" size={16} />,
      'Compras': <ShoppingBag className="text-pink-500" size={16} />,
      'Saúde': <Heart className="text-red-500" size={16} />,
      'Educação': <BookOpen className="text-indigo-500" size={16} />,
      'Lazer': <Gamepad2 className="text-green-500" size={16} />,
      'Salário': <Briefcase className="text-green-500" size={16} />,
      'Freelance': <Briefcase className="text-blue-500" size={16} />
    };
    
    if (iconMap[category]) return iconMap[category];
    return type === 'income' ? <ArrowUpRight className="text-green-500" size={16} /> : <ArrowDownLeft className="text-red-500" size={16} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 hover:bg-gray-50 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getCategoryIcon(transaction.category, transaction.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
            <p className="text-xs text-gray-500">{transaction.category}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'income' ? '+' : '-'} R$ {Math.abs(transaction.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="ml-4 relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10"
              >
                <button onClick={() => { onEdit(transaction); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Edit size={14} /><span>Editar</span>
                </button>
                <button onClick={() => { onDelete(transaction.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                  <Trash2 size={14} /><span>Excluir</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border"
    >
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Transações</h3>
        <p className="text-sm text-gray-500 mt-1">{transactions.length} transações encontradas</p>
      </div>

      <div className="divide-y">
        {transactions.length > 0 ? transactions.map((transaction, index) => (
          <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} index={index} />
        )) : (
          <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada.</p>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionList;
