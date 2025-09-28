import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  DollarSign, 
  GaugeCircle, 
  Wrench,
} from 'lucide-react';
import StatCard from '../StatCard';
import { Database } from '../../types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Refueling = Database['public']['Tables']['refuelings']['Row'];
type Maintenance = Database['public']['Tables']['vehicle_maintenances']['Row'];

interface VehiclesStatsProps {
  vehicles: Vehicle[];
  refuelings: Refueling[];
  maintenances: Maintenance[];
}

const VehiclesStats: React.FC<VehiclesStatsProps> = ({ vehicles, refuelings, maintenances }) => {
  const totalCostMonth = [...refuelings, ...maintenances]
    .filter(item => new Date(item.date).getMonth() === new Date().getMonth())
    .reduce((sum, item) => sum + item.cost, 0);

  const upcomingMaintenances = maintenances.filter(m => new Date(m.date) > new Date()).length;

  const stats = [
    {
      title: 'Total de Veículos',
      value: vehicles.length.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: Car
    },
    {
      title: 'Custo Total (Mês)',
      value: `R$ ${totalCostMonth.toFixed(2)}`,
      change: '',
      changeType: 'negative' as const,
      icon: DollarSign
    },
    {
      title: 'Eficiência Média',
      value: 'N/A',
      change: '',
      changeType: 'neutral' as const,
      icon: GaugeCircle
    },
    {
      title: 'Próximas Manutenções',
      value: upcomingMaintenances.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: Wrench
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default VehiclesStats;
