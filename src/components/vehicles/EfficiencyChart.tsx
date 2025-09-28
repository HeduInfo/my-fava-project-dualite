import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const EfficiencyChart: React.FC = () => {
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a0}: {c0} km/L<br/>{a1}: R$ {c1}/km'
    },
    grid: { top: 40, bottom: 40, left: 50, right: 50 },
    xAxis: {
      type: 'category',
      data: ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'],
    },
    yAxis: [
      {
        type: 'value',
        name: 'km/L',
        axisLabel: { formatter: '{value}' }
      },
      {
        type: 'value',
        name: 'R$/km',
        axisLabel: { formatter: '{value}' }
      }
    ],
    series: [
      {
        name: 'Eficiência',
        type: 'line',
        yAxisIndex: 0,
        data: [12.1, 11.8, 12.5, 11.5, 12.8, 12.2],
        smooth: true,
        itemStyle: { color: '#22c55e' },
      },
      {
        name: 'Custo/km',
        type: 'line',
        yAxisIndex: 1,
        data: [0.48, 0.51, 0.45, 0.53, 0.44, 0.49],
        smooth: true,
        itemStyle: { color: '#ef4444' },
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Eficiência e Custo (Honda Civic)
      </h3>
      <div className="h-64">
        <ReactECharts 
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </motion.div>
  );
};

export default EfficiencyChart;
