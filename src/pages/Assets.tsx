import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Package,
  Home,
  Laptop,
  Car,
  Grid3X3,
  List,
  Loader2
} from 'lucide-react';
import AssetsStats from '../components/assets/AssetsStats';
import AssetForm from '../components/assets/AssetForm';
import AssetsList from '../components/assets/AssetsList';
import AssetsOverview from '../components/assets/AssetsOverview';
import AssetsByCategory from '../components/assets/AssetsByCategory';
import ConfirmationModal from '../components/ConfirmationModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

const Assets: React.FC = () => {
  const { session } = useAuth();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) setAssets(data);
    if (error) console.error('Error fetching assets:', error);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
  };
  
  const handleDeleteAsset = (id: string) => {
    setDeletingAssetId(id);
  };

  const confirmDeleteAsset = async () => {
    if (!deletingAssetId) return;
    setIsDeleteLoading(true);
    const { error } = await supabase.from('assets').delete().eq('id', deletingAssetId);
    if (error) {
      console.error("Error deleting asset:", error);
    } else {
      setAssets(prev => prev.filter(a => a.id !== deletingAssetId));
    }
    setIsDeleteLoading(false);
    setDeletingAssetId(null);
  };

  const handleFormClose = () => {
    setShowAssetForm(false);
    setEditingAsset(null);
  };

  const handleFormSubmit = () => {
    fetchData();
    handleFormClose();
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: Package },
    { id: 'Imóveis', name: 'Imóveis', icon: Home },
    { id: 'Eletrônicos', name: 'Eletrônicos', icon: Laptop },
    { id: 'Veículos', name: 'Veículos', icon: Car },
    { id: 'Outros', name: 'Outros', icon: Package }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Módulo de Ativos</h1>
          <p className="text-gray-600 mt-1">Monitoramento completo do seu patrimônio físico</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
          <motion.button
            onClick={() => { setEditingAsset(null); setShowAssetForm(true); }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 text-sm"
          >
            <Plus size={16} /><span>Novo Ativo</span>
          </motion.button>
        </div>
      </div>

      <AssetsStats assets={assets} />

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar ativos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
          </select>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}><Grid3X3 size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}><List size={16} /></button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 text-primary-600 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AssetsList 
              assets={filteredAssets}
              viewMode={viewMode}
              onEdit={handleEditAsset}
              onDelete={handleDeleteAsset}
            />
          </div>
          <div className="space-y-6">
            <AssetsOverview assets={assets} />
            <AssetsByCategory assets={assets} />
          </div>
        </div>
      )}

      {(showAssetForm || editingAsset) && (
        <AssetForm
          assetToEdit={editingAsset}
          onClose={handleFormClose}
          onSubmitSuccess={handleFormSubmit}
        />
      )}

      <ConfirmationModal 
        isOpen={!!deletingAssetId}
        onClose={() => setDeletingAssetId(null)}
        onConfirm={confirmDeleteAsset}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este ativo? Esta ação não pode ser desfeita."
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Assets;
