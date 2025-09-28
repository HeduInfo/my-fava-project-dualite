import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-12 h-6 rounded-full ${enabled ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const NotificationsSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    financial: { email: true, push: true },
    assets: { email: true, push: false },
    vehicles: { email: true, push: true },
  });

  const handleToggle = (category: 'financial' | 'assets' | 'vehicles', type: 'email' | 'push', value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações de Notificação</h2>
      
      <div className="space-y-8">
        {/* Financial Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Financeiro</h3>
          <div className="space-y-4">
            <ToggleSwitch label="Vencimento de Contas" enabled={notifications.financial.email} onChange={v => handleToggle('financial', 'email', v)} />
            <ToggleSwitch label="Orçamento Excedido" enabled={notifications.financial.push} onChange={v => handleToggle('financial', 'push', v)} />
          </div>
        </div>

        {/* Assets Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Ativos</h3>
          <div className="space-y-4">
            <ToggleSwitch label="Vencimento de Garantia" enabled={notifications.assets.email} onChange={v => handleToggle('assets', 'email', v)} />
            <ToggleSwitch label="Lembrete de Manutenção" enabled={notifications.assets.push} onChange={v => handleToggle('assets', 'push', v)} />
          </div>
        </div>

        {/* Vehicles Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Veículos</h3>
          <div className="space-y-4">
            <ToggleSwitch label="Vencimento de IPVA" enabled={notifications.vehicles.email} onChange={v => handleToggle('vehicles', 'email', v)} />
            <ToggleSwitch label="Vencimento de Seguro" enabled={notifications.vehicles.push} onChange={v => handleToggle('vehicles', 'push', v)} />
            <ToggleSwitch label="Lembrete de Revisão" enabled={notifications.vehicles.push} onChange={v => handleToggle('vehicles', 'push', v)} />
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
        >
          Salvar Preferências
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationsSettings;
