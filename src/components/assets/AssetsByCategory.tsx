import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Home, Laptop, Package, Car } from 'lucide-react';
import { Database } from '../../types/database.types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetsByCategoryProps {
  assets: Asset[];
}

const AssetsByCategory: React.FC<AssetsByCategoryProps> = ({ assets }) => {
  const aggregatedData: { [key: string]: { value: number; count: number } } = assets.reduce((acc, asset) => {
    const value = asset.current_value || asset.acquisition_value;
    if (!acc[asset.category]) {
      acc[asset.category] = { value: 0, count: 0 };
    }
    acc[asset.category].value += value;
    acc[asset.category].count += 1;
    return acc;
  }, {} as { [key: string]: { value: number; count: number } });

  const chartData = Object.keys(aggregatedData).map(category => ({
    name: category,
    value: aggregatedData[category].value
  }));

  const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || asset.acquisition_value), 0);

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Imóveis': <Home size={16} />,
      'Veículos': <Car size={16} />,
      'Eletrônicos': <Laptop size={16} />,
    };
    return iconMap[category] || <Package size={16} />;
  };

  const chartOption = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : R$ {c} ({d}%)' },
    series: [{
      name: 'Valor por Categoria',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
      labelLine: { show: false },
      data: chartData,
    }]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ativos por Categoria</h3>
      
      {chartData.length > 0 ? (
        <>
          <div className="h-48 mb-4">
            <ReactECharts 
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
          <div className="space-y-2">
            {Object.entries(aggregatedData).map(([category, data], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-gray-600">
                    {getCategoryIcon(category)}
                    <span className="text-sm">{category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">R$ {(data.value / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-500">{data.count} {data.count === 1 ? 'item' : 'itens'}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Total Geral</span>
              <span className="text-lg font-bold text-primary-600">R$ {totalValue.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-gray-500">Sem dados de ativos.</p>
        </div>
      )}
    </motion.div>
  );
};

export default AssetsByCategory;
