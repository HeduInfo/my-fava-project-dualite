import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';

const ReportsSettings: React.FC = () => {
  const [reportConfig, setReportConfig] = useState({
    module: 'financial',
    period: 'current-month',
    startDate: '',
    endDate: '',
    format: 'pdf',
  });

  const handleInputChange = (field: string, value: string) => {
    setReportConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Relatórios Avançados</h2>
      
      <div className="space-y-6 max-w-lg">
        {/* Module Selection */}
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
            Módulo do Relatório
          </label>
          <select
            id="module"
            value={reportConfig.module}
            onChange={e => handleInputChange('module', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="financial">Financeiro</option>
            <option value="assets">Ativos</option>
            <option value="vehicles">Veículos</option>
          </select>
        </div>

        {/* Period Selection */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            id="period"
            value={reportConfig.period}
            onChange={e => handleInputChange('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="current-month">Mês Atual</option>
            <option value="last-month">Mês Anterior</option>
            <option value="current-year">Ano Atual</option>
            <option value="custom">Período Personalizado</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {reportConfig.period === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input type="date" id="startDate" className="w-full px-3 py-2 border border-gray-300 rounded-lg" onChange={e => handleInputChange('startDate', e.target.value)} />
            </div>
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
              <input type="date" id="endDate" className="w-full px-3 py-2 border border-gray-300 rounded-lg" onChange={e => handleInputChange('endDate', e.target.value)} />
            </div>
          </motion.div>
        )}

        {/* Format Selection */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Formato
          </label>
          <select
            id="format"
            value={reportConfig.format}
            onChange={e => handleInputChange('format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
          </select>
        </div>

        <div className="pt-4 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center space-x-2"
          >
            <Download size={16} />
            <span>Gerar e Baixar Relatório</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ReportsSettings;
