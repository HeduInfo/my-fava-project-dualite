import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Package, 
  Car, 
  Settings, 
  Menu, 
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { name: 'Ativos', href: '/ativos', icon: Package },
    { name: 'Veículos', href: '/veiculos', icon: Car },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const quickActions = [
    { name: 'Nova Receita', icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Nova Despesa', icon: TrendingDown, color: 'bg-red-500' },
    { name: 'Transferência', icon: DollarSign, color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-secondary-800 shadow-sm border-b dark:border-secondary-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">SySFava</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white dark:bg-secondary-800 border-b dark:border-secondary-700 shadow-lg"
          >
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-secondary-800 border-r border-gray-200 dark:border-secondary-700">
          <div className="flex flex-col flex-1">
            <div className="flex items-center px-6 py-4 border-b dark:border-secondary-700">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">SySFava</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Gestão</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 py-4 border-t dark:border-secondary-700">
              <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-700">
                <User className="text-gray-500 dark:text-gray-400" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{profile?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.role || 'Membro'}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:pl-64 flex-1">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-16 right-0 space-y-2"
            >
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${action.color} text-white p-3 rounded-full shadow-lg flex items-center space-x-2 min-w-max`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium pr-1">{action.name}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: showQuickAdd ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={24} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default Layout;
