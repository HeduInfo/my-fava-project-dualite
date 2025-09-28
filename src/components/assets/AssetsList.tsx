import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Edit, 
  Trash2,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Home,
  Laptop,
  Car,
  Package,
  Calendar
} from 'lucide-react';
import { Database } from '../../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetsListProps {
  assets: Asset[];
  viewMode: 'grid' | 'list';
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const AssetItem: React.FC<{ asset: Asset; onEdit: (asset: Asset) => void; onDelete: (id: string) => void; viewMode: 'grid' | 'list'; index: number }> = ({ asset, onEdit, onDelete, viewMode, index }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Imóveis': <Home className="text-purple-500" size={20} />,
      'Eletrônicos': <Laptop className="text-blue-500" size={20} />,
      'Eletrodomésticos': <Package className="text-green-500" size={20} />,
      'Veículos': <Car className="text-red-500" size={20} />,
      'Móveis': <Package className="text-orange-500" size={20} />
    };
    return iconMap[category] || <Package className="text-gray-500" size={20} />;
  };

  const getConditionColor = (condition: string | null) => {
    const colorMap: { [key: string]: string } = {
      'excellent': 'text-green-600 bg-green-100',
      'good': 'text-blue-600 bg-blue-100',
      'fair': 'text-yellow-600 bg-yellow-100',
      'poor': 'text-orange-600 bg-orange-100',
      'damaged': 'text-red-600 bg-red-100'
    };
    return colorMap[condition || ''] || 'text-gray-600 bg-gray-100';
  };

  const getWarrantyIcon = (warrantyDate: string | null) => {
    if (!warrantyDate) return null;
    const today = new Date();
    const expiration = new Date(warrantyDate);
    const diffDays = (expiration.getTime() - today.getTime()) / (1000 * 3600 * 24);
    if (diffDays < 0) return <AlertTriangle className="text-red-500" size={16} />;
    if (diffDays <= 30) return <AlertTriangle className="text-yellow-500" size={16} />;
    return <CheckCircle className="text-green-500" size={16} />;
  };

  const calculateValueChange = (acquisition: number, current: number | null) => {
    if (current === null) return { percentage: 'N/A', isPositive: true };
    const change = ((current - acquisition) / acquisition) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const valueChange = calculateValueChange(asset.acquisition_value, asset.current_value);

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {getCategoryIcon(asset.category)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{asset.name}</h3>
              <p className="text-sm text-gray-500">{asset.category}</p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical size={16} className="text-gray-400" />
            </button>
            <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10"
              >
                <button onClick={() => { onEdit(asset); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Edit size={14} /><span>Editar</span>
                </button>
                <button onClick={() => { onDelete(asset.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                  <Trash2 size={14} /><span>Excluir</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Valor Atual</span>
            <span className="font-semibold text-gray-900">R$ {asset.current_value?.toLocaleString('pt-BR') || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Variação</span>
            <div className={`flex items-center space-x-1 ${valueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {valueChange.percentage !== 'N/A' && (valueChange.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
              <span className="text-sm font-medium">{valueChange.percentage !== 'N/A' ? `${valueChange.percentage}%` : 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <MapPin className="text-gray-400" size={14} />
              <span className="text-xs text-gray-500">{asset.location || 'N/A'}</span>
            </div>
            <div className="flex space-x-2">{getWarrantyIcon(asset.warranty_expiration)}</div>
          </div>
          <div className="pt-2 border-t">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
              {asset.condition || 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 hover:bg-gray-50 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {getCategoryIcon(asset.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 truncate">{asset.name}</h4>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
                {asset.condition || 'N/A'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{asset.category}</p>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <MapPin className="text-gray-400" size={12} />
                <span className="text-xs text-gray-500">{asset.location || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="text-gray-400" size={12} />
                <span className="text-xs text-gray-500">{new Date(asset.acquisition_date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-gray-900">R$ {asset.current_value?.toLocaleString('pt-BR') || 'N/A'}</p>
          <div className={`flex items-center space-x-1 justify-end ${valueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {valueChange.percentage !== 'N/A' && (valueChange.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
            <span className="text-xs">{valueChange.percentage !== 'N/A' ? `${valueChange.percentage}%` : 'N/A'}</span>
          </div>
          <div className="flex items-center justify-end space-x-1 mt-1">{getWarrantyIcon(asset.warranty_expiration)}</div>
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
                <button onClick={() => { onEdit(asset); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Edit size={14} /><span>Editar</span>
                </button>
                <button onClick={() => { onDelete(asset.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
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

const AssetsList: React.FC<AssetsListProps> = ({ assets, viewMode, onEdit, onDelete }) => {
  if (!assets.length) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ativo encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">Comece cadastrando seu primeiro ativo.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {assets.map((asset, index) => (
          <AssetItem key={asset.id} asset={asset} onEdit={onEdit} onDelete={onDelete} viewMode="grid" index={index} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border divide-y"
    >
      {assets.map((asset, index) => (
        <AssetItem key={asset.id} asset={asset} onEdit={onEdit} onDelete={onDelete} viewMode="list" index={index} />
      ))}
    </motion.div>
  );
};

export default AssetsList;
