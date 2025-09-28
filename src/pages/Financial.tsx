import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import FinancialStats from '../components/financial/FinancialStats';
import TransactionForm from '../components/financial/TransactionForm';
import TransactionList from '../components/financial/TransactionList';
import AccountsOverview from '../components/financial/AccountsOverview';
import CategoryChart from '../components/financial/CategoryChart';
import ConfirmationModal from '../components/ConfirmationModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Account = Database['public']['Tables']['accounts']['Row'];

const Financial: React.FC = () => {
  const { session } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', session.user.id);

    if (transactionsData) setTransactions(transactionsData);
    if (accountsData) setAccounts(accountsData);
    
    if (transactionsError) console.error('Error fetching transactions:', transactionsError);
    if (accountsError) console.error('Error fetching accounts:', accountsError);

    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNewTransaction = (type: 'income' | 'expense') => {
    setEditingTransaction(null);
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionType(transaction.type as 'income' | 'expense');
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setDeletingTransactionId(id);
  };

  const confirmDeleteTransaction = async () => {
    if (!deletingTransactionId) return;
    setIsDeleteLoading(true);
    const { error } = await supabase.from('transactions').delete().eq('id', deletingTransactionId);
    if (error) {
      console.error("Error deleting transaction:", error);
    } else {
      setTransactions(prev => prev.filter(t => t.id !== deletingTransactionId));
    }
    setIsDeleteLoading(false);
    setDeletingTransactionId(null);
  };

  const handleFormClose = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Módulo Financeiro</h1>
          <p className="text-gray-600 mt-1">Controle completo das suas movimentações financeiras</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
          <motion.button onClick={() => handleNewTransaction('income')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2 text-sm">
            <TrendingUp size={16} /><span>Nova Receita</span>
          </motion.button>
          <motion.button onClick={() => handleNewTransaction('expense')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center space-x-2 text-sm">
            <TrendingDown size={16} /><span>Nova Despesa</span>
          </motion.button>
        </div>
      </div>

      <FinancialStats transactions={transactions} />

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar transações..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TransactionList 
            transactions={filteredTransactions} 
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
        <div className="space-y-6">
          <AccountsOverview accounts={accounts} />
          <CategoryChart data={transactions.filter(t => t.type === 'expense')} />
        </div>
      </div>

      {(showTransactionForm || editingTransaction) && (
        <TransactionForm
          type={transactionType}
          accounts={accounts}
          transactionToEdit={editingTransaction}
          onClose={handleFormClose}
          onSubmitSuccess={fetchData}
        />
      )}

      <ConfirmationModal 
        isOpen={!!deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={confirmDeleteTransaction}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita."
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Financial;
