import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Database, KeyRound, Save } from 'lucide-react';

const InfrastructureSettings: React.FC = () => {
  const isDbConnected = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="space-y-8">
      {/* Database Connection */}
      <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Banco de Dados</h2>
        <div className={`p-4 rounded-lg flex items-center space-x-4 ${isDbConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {isDbConnected ? (
            <ShieldCheck className="text-green-600" size={32} />
          ) : (
            <ShieldAlert className="text-red-600" size={32} />
          )}
          <div>
            <h3 className={`font-semibold ${isDbConnected ? 'text-green-800' : 'text-red-800'}`}>
              {isDbConnected ? 'Conexão Ativa' : 'Não Conectado'}
            </h3>
            <p className={`text-sm ${isDbConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isDbConnected ? 'Seus dados estão sendo salvos e sincronizados.' : 'Para salvar seus dados, conecte um banco de dados Supabase.'}
            </p>
          </div>
        </div>
        {!isDbConnected && (
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 text-sm"
            >
              <Database size={16} />
              <span>Conectar com Supabase</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Gerenciamento de Chaves de API</h2>
        <p className="text-sm text-gray-600 mb-6">
          Adicione suas chaves de API para integrar com serviços externos de forma segura.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="fipeApi" className="block text-sm font-medium text-gray-700 mb-1">
              API Tabela FIPE
            </label>
            <div className="relative max-w-md">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                id="fipeApi"
                placeholder="******************"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          {/* Add other API keys here */}

          <div className="pt-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 text-sm"
            >
              <Save size={16} />
              <span>Salvar Chaves</span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfrastructureSettings;
