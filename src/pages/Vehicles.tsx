import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Grid3X3,
  List,
  Loader2
} from 'lucide-react';
import VehiclesStats from '../components/vehicles/VehiclesStats';
import VehicleForm from '../components/vehicles/VehicleForm';
import VehiclesList from '../components/vehicles/VehiclesList';
import VehiclesOverview from '../components/vehicles/VehiclesOverview';
import EfficiencyChart from '../components/vehicles/EfficiencyChart';
import RefuelingForm from '../components/vehicles/RefuelingForm';
import MaintenanceForm from '../components/vehicles/MaintenanceForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Refueling = Database['public']['Tables']['refuelings']['Row'];
type Maintenance = Database['public']['Tables']['vehicle_maintenances']['Row'];

const Vehicles: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refuelings, setRefuelings] = useState<Refueling[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [showRefuelingForm, setShowRefuelingForm] = useState<Vehicle | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState<Vehicle | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);

    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (vehiclesData) {
      setVehicles(vehiclesData);
      const vehicleIds = vehiclesData.map(v => v.id);

      const { data: refuelingsData } = await supabase.from('refuelings').select('*').in('vehicle_id', vehicleIds);
      if (refuelingsData) setRefuelings(refuelingsData);

      const { data: maintenancesData } = await supabase.from('vehicle_maintenances').select('*').in('vehicle_id', vehicleIds);
      if (maintenancesData) setMaintenances(maintenancesData);
    }
    
    if (vehiclesError) console.error('Error fetching vehicles:', vehiclesError);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };
  
  const handleDeleteVehicle = (id: string) => {
    setDeletingVehicleId(id);
  };

  const confirmDeleteVehicle = async () => {
    if (!deletingVehicleId) return;
    setIsDeleteLoading(true);
    const { error } = await supabase.from('vehicles').delete().eq('id', deletingVehicleId);
    if (error) {
      console.error("Error deleting vehicle:", error);
    } else {
      setVehicles(prev => prev.filter(v => v.id !== deletingVehicleId));
    }
    setIsDeleteLoading(false);
    setDeletingVehicleId(null);
  };

  const handleFormClose = () => {
    setShowVehicleForm(false);
    setEditingVehicle(null);
    setShowRefuelingForm(null);
    setShowMaintenanceForm(null);
  };

  const handleFormSubmit = () => {
    fetchData();
    handleFormClose();
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  const vehicleTypes = [
    { id: 'all', name: 'Todos' },
    { id: 'Carro', name: 'Carros' },
    { id: 'Moto', name: 'Motos' },
    { id: 'Caminhão', name: 'Caminhões' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Módulo de Veículos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestão completa da sua frota pessoal ou empresarial</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <motion.button
            onClick={() => { setEditingVehicle(null); setShowVehicleForm(true); }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 text-sm"
          >
            <Plus size={16} /><span>Novo Veículo</span>
          </motion.button>
        </div>
      </div>

      <VehiclesStats vehicles={vehicles} refuelings={refuelings} maintenances={maintenances} />

      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border dark:border-secondary-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, placa ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {vehicleTypes.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))}
          </select>
          <div className="flex rounded-lg border border-gray-300 dark:border-secondary-600 overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-700 text-gray-600 dark:text-gray-300'}`}><Grid3X3 size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-700 text-gray-600 dark:text-gray-300'}`}><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehiclesList 
            vehicles={filteredVehicles}
            viewMode={viewMode}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onAddRefueling={setShowRefuelingForm}
            onAddMaintenance={setShowMaintenanceForm}
          />
        </div>
        <div className="space-y-6">
          <VehiclesOverview vehicles={vehicles} maintenances={maintenances} />
          <EfficiencyChart refuelings={refuelings} />
        </div>
      </div>

      {(showVehicleForm || editingVehicle) && (
        <VehicleForm
          vehicleToEdit={editingVehicle}
          onClose={handleFormClose}
          onSubmitSuccess={handleFormSubmit}
        />
      )}
      {showRefuelingForm && (
        <RefuelingForm
          vehicle={showRefuelingForm}
          onClose={handleFormClose}
          onSubmitSuccess={handleFormSubmit}
        />
      )}
      {showMaintenanceForm && (
        <MaintenanceForm
          vehicle={showMaintenanceForm}
          onClose={handleFormClose}
          onSubmitSuccess={handleFormSubmit}
        />
      )}
      <ConfirmationModal 
        isOpen={!!deletingVehicleId}
        onClose={() => setDeletingVehicleId(null)}
        onConfirm={confirmDeleteVehicle}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este veículo e todo o seu histórico? Esta ação não pode ser desfeita."
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Vehicles;
