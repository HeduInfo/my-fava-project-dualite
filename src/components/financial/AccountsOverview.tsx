import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  PiggyBank, 
  DollarSign, 
  Eye,
  EyeOff
} from 'lucide-react';
import { Database } from '../../types/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];

interface AccountsOverviewProps {
  accounts: Account[];
}

const AccountsOverview: React.FC<AccountsOverviewProps> = ({ accounts }) => {
  const [showBalances, setShowBalances] = useState(true);
  
  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'corrente': return <CreditCard className="text-blue-500" size={20} />;
      case 'poupança': return <PiggyBank className="text-green-500" size={20} />;
      case 'dinheiro': return <DollarSign className="text-purple-500" size={20} />;
      case 'crédito': return <CreditCard className="text-red-500" size={20} />;
      default: return <CreditCard className="text-gray-500" size={20} />;
    }
  };

  const formatBalance = (balance: number) => {
    if (!showBalances) return '••••••';
    return `R$ ${Math.abs(balance).toFixed(2)}`;
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Resumo de Contas</h3>
        <button onClick={() => setShowBalances(!showBalances)} className="p-2 hover:bg-gray-100 rounded-lg">
          {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="mb-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-600 font-medium mb-1">Saldo Total</p>
        <p className="text-2xl font-bold text-primary-700">{formatBalance(totalBalance)}</p>
      </div>

      <div className="space-y-3">
        {accounts.length > 0 ? accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {getAccountIcon(account.type)}
              </div>
              <p className="text-sm font-medium text-gray-900">{account.name}</p>
            </div>
            <p className={`text-sm font-medium ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {account.balance < 0 && '-'}{formatBalance(account.balance)}
            </p>
          </motion.div>
        )) : (
          <p className="text-center text-sm text-gray-500 py-4">Nenhuma conta cadastrada.</p>
        )}
      </div>

      <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors">
        + Adicionar Nova Conta
      </button>
    </motion.div>
  );
};

export default AccountsOverview;
