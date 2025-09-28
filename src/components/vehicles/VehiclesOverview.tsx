import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CalendarDays,
  Wrench,
  Fuel
} from 'lucide-react';

const VehiclesOverview: React.FC = () => {
  const alerts = [
    {
      type: 'licensing',
      title: 'Licenciamento Próximo',
      vehicle: 'Corolla Cross',
      dueDate: '10/02/2025',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    {
      type: 'insurance',
      title: 'Seguro Vencendo',
      vehicle: 'Corolla Cross',
      dueDate: '28/02/2025',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      type: 'maintenance',
      title: 'Manutenção Atrasada',
      vehicle: 'Honda Civic',
      details: 'Revisão 60.000km',
      color: 'text-red-600 bg-red-50 border-red-200'
    }
  ];

  const recentActivities = [
    { type: 'refueling', vehicle: 'MT-07', details: '20L Gasolina - R$ 115,80' },
    { type: 'maintenance', vehicle: 'Corolla Cross', details: 'Troca de óleo - R$ 250,00' },
    { type: 'refueling', vehicle: 'Honda Civic', details: '40L Etanol - R$ 159,60' },
  ];

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Alertas e Avisos</h3>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${alert.color}`}
            >
              <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
              <p className="text-xs opacity-90 font-medium">{alert.vehicle}</p>
              <p className="text-xs opacity-80">
                {alert.details ? alert.details : `Vencimento: ${alert.dueDate}`}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'refueling' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                {activity.type === 'refueling' ? <Fuel size={16} className="text-blue-600"/> : <Wrench size={16} className="text-yellow-600"/>}
              </div>
              <div>
                <p className="text-sm font-medium">{activity.vehicle}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default VehiclesOverview;
