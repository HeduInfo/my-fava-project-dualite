import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../types/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

interface TransactionFormProps {
  type: 'income' | 'expense';
  accounts: Account[];
  transactionToEdit?: Transaction | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, accounts, transactionToEdit, onClose, onSubmitSuccess }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    account_id: accounts.length > 0 ? accounts[0].id : '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    is_recurring: false,
  });

  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        description: transactionToEdit.description,
        amount: String(transactionToEdit.amount),
        category: transactionToEdit.category,
        account_id: transactionToEdit.account_id,
        date: new Date(transactionToEdit.date).toISOString().split('T')[0],
        notes: transactionToEdit.notes || '',
        is_recurring: transactionToEdit.is_recurring,
      });
    }
  }, [transactionToEdit, isEditing]);

  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'];
  const expenseCategories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Serviços', 'Outros'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !formData.account_id) {
      setError("Usuário não autenticado ou nenhuma conta selecionada.");
      return;
    }
    setLoading(true);
    setError(null);

    const transactionData = {
      ...formData,
      user_id: session.user.id,
      type: type,
      amount: parseFloat(formData.amount),
      notes: formData.notes || null,
    };

    let response;
    if (isEditing) {
      response = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', transactionToEdit.id);
    } else {
      response = await supabase
        .from('transactions')
        .insert(transactionData);
    }
    
    const { error: queryError } = response;

    setLoading(false);
    if (queryError) {
      setError(queryError.message);
      console.error(queryError);
    } else {
      onSubmitSuccess();
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar' : 'Nova'} {type === 'income' ? 'Receita' : 'Despesa'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
              <input type="text" required value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Ex: Supermercado, Salário..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" step="0.01" required value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} placeholder="0,00" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select required value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Selecione uma categoria</option>
                {(type === 'income' ? incomeCategories : expenseCategories).map(category => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conta *</label>
              <select required value={formData.account_id} onChange={(e) => handleInputChange('account_id', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {accounts.map(account => (<option key={account.id} value={account.id}>{account.name} - R$ {account.balance.toFixed(2)}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="date" required value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="recurring" checked={formData.is_recurring} onChange={(e) => handleInputChange('is_recurring', e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="recurring" className="text-sm text-gray-700">Transação recorrente</label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={loading} className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex justify-center items-center ${isEditing ? 'bg-primary-600 hover:bg-primary-700' : (type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')} disabled:bg-gray-400`}>
                {loading ? <Loader2 className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Salvar')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionForm;
