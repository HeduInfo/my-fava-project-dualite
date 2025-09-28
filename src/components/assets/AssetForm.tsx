import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetFormProps {
  assetToEdit?: Asset | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ assetToEdit, onClose, onSubmitSuccess }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    acquisition_value: '',
    current_value: '',
    acquisition_date: '',
    location: '',
    brand: '',
    model: '',
    serial_number: '',
    warranty_expiration: '',
    condition: 'good',
    notes: '',
  });

  const isEditing = !!assetToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: assetToEdit.name,
        category: assetToEdit.category,
        acquisition_value: String(assetToEdit.acquisition_value),
        current_value: String(assetToEdit.current_value || ''),
        acquisition_date: new Date(assetToEdit.acquisition_date).toISOString().split('T')[0],
        location: assetToEdit.location || '',
        brand: assetToEdit.brand || '',
        model: assetToEdit.model || '',
        serial_number: assetToEdit.serial_number || '',
        warranty_expiration: assetToEdit.warranty_expiration ? new Date(assetToEdit.warranty_expiration).toISOString().split('T')[0] : '',
        condition: assetToEdit.condition || 'good',
        notes: assetToEdit.notes || '',
      });
    }
  }, [assetToEdit, isEditing]);

  const categories = ['Imóveis', 'Eletrônicos', 'Eletrodomésticos', 'Móveis', 'Equipamentos', 'Ferramentas', 'Joias', 'Arte', 'Outros'];
  const conditions = [{ value: 'excellent', label: 'Excelente' }, { value: 'good', label: 'Bom' }, { value: 'fair', label: 'Regular' }, { value: 'poor', label: 'Ruim' }, { value: 'damaged', label: 'Danificado' }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("Usuário não autenticado.");
      return;
    }
    setLoading(true);
    setError(null);

    const assetData = {
      ...formData,
      user_id: session.user.id,
      acquisition_value: parseFloat(formData.acquisition_value),
      current_value: formData.current_value ? parseFloat(formData.current_value) : null,
      warranty_expiration: formData.warranty_expiration || null,
    };

    let response;
    if (isEditing) {
      response = await supabase.from('assets').update(assetData).eq('id', assetToEdit.id);
    } else {
      response = await supabase.from('assets').insert(assetData);
    }

    setLoading(false);
    if (response.error) {
      setError(response.error.message);
    } else {
      onSubmitSuccess();
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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Ativo' : 'Cadastrar Novo Ativo'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Ativo *</label>
                  <input type="text" required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: MacBook Pro, Apartamento..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                  <select required value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Selecione</option>
                    {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor de Aquisição *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="number" step="0.01" required value={formData.acquisition_value} onChange={(e) => handleInputChange('acquisition_value', e.target.value)} placeholder="0,00" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Atual</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="number" step="0.01" value={formData.current_value} onChange={(e) => handleInputChange('current_value', e.target.value)} placeholder="0,00" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Aquisição *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="date" required value={formData.acquisition_date} onChange={(e) => handleInputChange('acquisition_date', e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="Ex: Casa, Escritório..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes Técnicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} placeholder="Marca" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} placeholder="Modelo" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" value={formData.serial_number} onChange={(e) => handleInputChange('serial_number', e.target.value)} placeholder="Número de Série" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <select value={formData.condition} onChange={(e) => handleInputChange('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {conditions.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
                </select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vencimento da Garantia</label>
                  <input type="date" value={formData.warranty_expiration} onChange={(e) => handleInputChange('warranty_expiration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Cadastrar Ativo')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetForm;
