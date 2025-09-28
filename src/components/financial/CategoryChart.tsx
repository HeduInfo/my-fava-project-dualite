import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Database } from '../../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface CategoryChartProps {
  data: Transaction[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const aggregatedData: { [key: string]: number } = data.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.keys(aggregatedData).map(category => ({
    name: category,
    value: aggregatedData[category]
  }));

  const chartOption = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : R$ {c} ({d}%)' },
    series: [{
      name: 'Despesas por Categoria',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
      
      {chartData.length > 0 ? (
        <div className="h-48 mb-4">
          <ReactECharts 
            option={chartOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-gray-500">Sem dados de despesas.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryChart;
