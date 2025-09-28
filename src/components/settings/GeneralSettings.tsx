import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    appName: 'SySFava',
    language: 'pt-BR',
    currency: 'BRL',
  });

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border dark:border-secondary-700 p-6 lg:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Configurações Gerais</h2>
      
      <form className="space-y-6">
        {/* App Name */}
        <div>
          <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome da Aplicação
          </label>
          <input
            type="text"
            id="appName"
            value={settings.appName}
            onChange={(e) => handleInputChange('appName', e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Idioma
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (United States)</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Moeda
          </label>
          <select
            id="currency"
            value={settings.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
          >
            <option value="BRL">Real Brasileiro (R$)</option>
            <option value="USD">Dólar Americano ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tema da Interface
          </label>
          <div className="flex space-x-4 text-gray-700 dark:text-gray-300">
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={(e) => setTheme(e.target.value as any)} className="text-primary-600 focus:ring-primary-500"/>
              <span>Claro</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={(e) => setTheme(e.target.value as any)} className="text-primary-600 focus:ring-primary-500"/>
              <span>Escuro</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" value="system" checked={theme === 'system'} onChange={(e) => setTheme(e.target.value as any)} className="text-primary-600 focus:ring-primary-500"/>
              <span>Padrão do Sistema</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t dark:border-secondary-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Salvar Alterações
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
