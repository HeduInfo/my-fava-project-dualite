import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Fuel, 
  Wrench, 
  Car,
  Bike,
  Truck,
  GaugeCircle,
  CalendarDays,
  Edit,
  Trash2
} from 'lucide-react';
import { Database } from '../../types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehiclesListProps {
  vehicles: Vehicle[];
  viewMode: 'grid' | 'list';
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onAddRefueling: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
}

const VehicleItem: React.FC<{ vehicle: Vehicle; viewMode: 'grid' | 'list'; onEdit: (vehicle: Vehicle) => void; onDelete: (id: string) => void; onAddRefueling: (vehicle: Vehicle) => void; onAddMaintenance: (vehicle: Vehicle) => void; index: number }> = ({ vehicle, viewMode, onEdit, onDelete, onAddRefueling, onAddMaintenance, index }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'Carro': return <Car className="text-blue-500" size={24} />;
      case 'Moto': return <Bike className="text-purple-500" size={24} />;
      case 'Caminhão': return <Truck className="text-red-500" size={24} />;
      default: return <Car className="text-gray-500" size={24} />;
    }
  };

  const defaultImage = "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600";

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border dark:border-secondary-700 group overflow-hidden"
      >
        <div className="relative">
          <img src={defaultImage} alt={vehicle.name} className="h-40 w-full object-cover"/>
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">
            {vehicle.license_plate}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{vehicle.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-full">
                <MoreVertical size={16} className="text-gray-400" />
              </button>
              <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-secondary-700 rounded-md shadow-lg border dark:border-secondary-600 z-10"
                >
                  <button onClick={() => { onEdit(vehicle); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600 flex items-center space-x-2">
                    <Edit size={14} /><span>Editar</span>
                  </button>
                  <button onClick={() => { onDelete(vehicle.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center space-x-2">
                    <Trash2 size={14} /><span>Excluir</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Odômetro</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{vehicle.odometer.toLocaleString('pt-BR')} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Eficiência</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">N/A</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button onClick={() => onAddRefueling(vehicle)} className="flex-1 text-xs text-center py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900">Abastecer</button>
            <button onClick={() => onAddMaintenance(vehicle)} className="flex-1 text-xs text-center py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900">Manutenção</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 hover:bg-gray-100 dark:hover:bg-secondary-700 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-12 bg-gray-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
            {getVehicleIcon(vehicle.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{vehicle.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.brand} {vehicle.model} - {vehicle.license_plate}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Odômetro</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{vehicle.odometer.toLocaleString('pt-BR')} km</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Eficiência</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">N/A</p>
          </div>
        </div>
        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-200 dark:hover:bg-secondary-600 rounded-full"><MoreVertical size={16} className="text-gray-500"/></button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-8 w-40 bg-white dark:bg-secondary-700 rounded-md shadow-lg border dark:border-secondary-600 z-10"
              >
                <button onClick={() => { onAddRefueling(vehicle); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600 flex items-center space-x-2">
                  <Fuel size={14} /><span>Abastecer</span>
                </button>
                <button onClick={() => { onAddMaintenance(vehicle); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600 flex items-center space-x-2">
                  <Wrench size={14} /><span>Manutenção</span>
                </button>
                <div className="border-t dark:border-secondary-600 my-1"></div>
                <button onClick={() => { onEdit(vehicle); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600 flex items-center space-x-2">
                  <Edit size={14} /><span>Editar</span>
                </button>
                <button onClick={() => { onDelete(vehicle.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center space-x-2">
                  <Trash2 size={14} /><span>Excluir</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles, viewMode, onEdit, onDelete, onAddRefueling, onAddMaintenance }) => {
  if (!vehicles.length) {
    return (
      <div className="text-center py-16 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border dark:border-secondary-700">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhum veículo encontrado</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece cadastrando seu primeiro veículo.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {vehicles.map((vehicle, index) => (
          <VehicleItem key={vehicle.id} vehicle={vehicle} viewMode="grid" onEdit={onEdit} onDelete={onDelete} onAddRefueling={onAddRefueling} onAddMaintenance={onAddMaintenance} index={index} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border dark:border-secondary-700 divide-y dark:divide-secondary-700"
    >
      {vehicles.map((vehicle, index) => (
        <VehicleItem key={vehicle.id} vehicle={vehicle} viewMode="list" onEdit={onEdit} onDelete={onDelete} onAddRefueling={onAddRefueling} onAddMaintenance={onAddMaintenance} index={index} />
      ))}
    </motion.div>
  );
};

export default VehiclesList;
