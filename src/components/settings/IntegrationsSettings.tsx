import React from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, XCircle, Banknote } from 'lucide-react';

const integrations = [
  {
    name: 'Tabela FIPE',
    description: 'Consulta automática de valores de veículos.',
    icon: <Banknote className="text-blue-500" size={24} />,
    connected: false,
  },
  {
    name: 'Integração Bancária (Open Finance)',
    description: 'Importação automática de transações bancárias.',
    icon: <Banknote className="text-green-500" size={24} />,
    connected: false,
  },
];

const IntegrationsSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Integrações com Serviços</h2>
      
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {integration.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {integration.connected ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <XCircle size={16} />
                  <span className="text-sm font-medium">Não Conectado</span>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings size={14} />
                <span>Configurar</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSettings;
