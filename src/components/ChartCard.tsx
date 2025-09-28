import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Database } from '../types/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data?: any;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, type, data }) => {
  const getChartOption = () => {
    if (type === 'line') {
      // Logic for line chart remains the same for now, can be updated later
      return {
        tooltip: { trigger: 'axis' },
        grid: { top: 20, bottom: 40, left: 60, right: 20 },
        xAxis: { type: 'category', data: ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'] },
        yAxis: { type: 'value', axisLabel: { formatter: 'R$ {value}k' } },
        series: [
          { name: 'Receitas', type: 'line', data: [7.2, 8.1, 8.5, 9.2, 8.8, 8.5], smooth: true, itemStyle: { color: '#22c55e' } },
          { name: 'Despesas', type: 'line', data: [5.8, 6.2, 5.9, 7.1, 6.8, 4.3], smooth: true, itemStyle: { color: '#ef4444' } }
        ]
      };
    }

    if (type === 'pie' && data) {
      const expenseData = data as Transaction[];
      const aggregatedData: { [key: string]: number } = expenseData.reduce((acc, transaction) => {
        if (transaction.type === 'expense') {
          acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        }
        return acc;
      }, {} as { [key: string]: number });

      const chartData = Object.keys(aggregatedData).map(category => ({
        name: category,
        value: aggregatedData[category]
      }));

      return {
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : R$ {c} ({d}%)' },
        series: [{
          name: 'Despesas',
          type: 'pie',
          radius: '70%',
          data: chartData,
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
      };
    }

    return {};
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ReactECharts 
          option={getChartOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </motion.div>
  );
};

export default ChartCard;
