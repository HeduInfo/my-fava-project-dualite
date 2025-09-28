import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowLeftRight, Calculator, Receipt, Car } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      name: 'Nova Receita',
      icon: Plus,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'Nova Despesa',
      icon: Minus,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      name: 'Transferência',
      icon: ArrowLeftRight,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      name: 'Calculadora',
      icon: Calculator,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      name: 'Anexar Nota',
      icon: Receipt,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      name: 'Abastecimento',
      icon: Car,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ações Rápidas
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors shadow-sm`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium text-center leading-tight">
                {action.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
