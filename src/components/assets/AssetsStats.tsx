import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  Home, 
  Wrench,
} from 'lucide-react';
import StatCard from '../StatCard';
import { Database } from '../../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetsStatsProps {
  assets: Asset[];
}

const AssetsStats: React.FC<AssetsStatsProps> = ({ assets }) => {
  const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || asset.acquisition_value), 0);
  const totalAcquisitionValue = assets.reduce((sum, asset) => sum + asset.acquisition_value, 0);
  const appreciation = totalValue - totalAcquisitionValue;
  const appreciationPercentage = totalAcquisitionValue > 0 ? (appreciation / totalAcquisitionValue) * 100 : 0;

  const stats = [
    {
      title: 'Valor Total',
      value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '',
      changeType: 'neutral' as const,
      icon: Package
    },
    {
      title: 'Valorização',
      value: `R$ ${appreciation.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${appreciationPercentage.toFixed(1)}%`,
      changeType: appreciation >= 0 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp
    },
    {
      title: 'Total de Bens',
      value: assets.length.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: Home
    },
    {
      title: 'Manutenções',
      value: 'N/A',
      change: '',
      changeType: 'neutral' as const,
      icon: Wrench
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

export default AssetsStats;
