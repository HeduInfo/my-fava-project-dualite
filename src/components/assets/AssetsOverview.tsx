import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Wrench,
} from 'lucide-react';
import { Database } from '../../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetsOverviewProps {
  assets: Asset[];
}

const AssetsOverview: React.FC<AssetsOverviewProps> = ({ assets }) => {
  const expiringWarranties = assets.filter(asset => {
    if (!asset.warranty_expiration) return false;
    const today = new Date();
    const expiration = new Date(asset.warranty_expiration);
    const diffDays = (expiration.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Alertas e Avisos</h3>
        </div>
        
        <div className="space-y-3">
          {expiringWarranties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg border text-yellow-600 bg-yellow-50 border-yellow-200"
            >
              <h4 className="font-medium text-sm mb-2">Garantias Vencendo</h4>
              <div className="space-y-1">
                {expiringWarranties.map((asset) => (
                  <p key={asset.id} className="text-xs opacity-80">• {asset.name}</p>
                ))}
              </div>
            </motion.div>
          )}
          {expiringWarranties.length === 0 && (
             <p className="text-sm text-gray-500 text-center py-4">Nenhum alerta no momento.</p>
          )}
        </div>
      </motion.div>

      {/* Maintenance Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Wrench className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Agenda de Manutenção</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">Funcionalidade em desenvolvimento.</p>
      </motion.div>
    </div>
  );
};

export default AssetsOverview;
