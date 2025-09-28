import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Users, 
  Database, 
  Bell, 
  FileText, 
  Plug
} from 'lucide-react';
import GeneralSettings from '../components/settings/GeneralSettings';
import UserSettings from '../components/settings/UserSettings';
import InfrastructureSettings from '../components/settings/InfrastructureSettings';
import NotificationsSettings from '../components/settings/NotificationsSettings';
import ReportsSettings from '../components/settings/ReportsSettings';
import IntegrationsSettings from '../components/settings/IntegrationsSettings';

type Tab = 'general' | 'users' | 'infra' | 'notifications' | 'reports' | 'integrations';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const tabs = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'infra', label: 'Infraestrutura', icon: Database },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'integrations', label: 'Integrações', icon: Plug },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'users':
        return <UserSettings />;
      case 'infra':
        return <InfrastructureSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'reports':
        return <ReportsSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Configurações
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie as configurações do sistema, usuários e integrações.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Navigation */}
        <aside className="lg:w-1/4">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
