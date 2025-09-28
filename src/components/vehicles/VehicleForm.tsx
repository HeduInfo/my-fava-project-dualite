import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehicleFormProps {
  vehicleToEdit?: Vehicle | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicleToEdit, onClose, onSubmitSuccess }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    odometer: '',
    type: 'Carro',
    fuel_type: 'Flex',
    licensing_date: '',
    insurance_renewal_date: '',
  });

  const isEditing = !!vehicleToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: vehicleToEdit.name,
        brand: vehicleToEdit.brand,
        model: vehicleToEdit.model,
        year: vehicleToEdit.year,
        license_plate: vehicleToEdit.license_plate,
        odometer: String(vehicleToEdit.odometer),
        type: vehicleToEdit.type,
        fuel_type: vehicleToEdit.fuel_type,
        licensing_date: vehicleToEdit.licensing_date ? new Date(vehicleToEdit.licensing_date).toISOString().split('T')[0] : '',
        insurance_renewal_date: vehicleToEdit.insurance_renewal_date ? new Date(vehicleToEdit.insurance_renewal_date).toISOString().split('T')[0] : '',
      });
    }
  }, [vehicleToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("Usuário não autenticado.");
      return;
    }
    setLoading(true);
    setError(null);

    const vehicleData = {
      ...formData,
      user_id: session.user.id,
      year: Number(formData.year),
      odometer: Number(formData.odometer),
      licensing_date: formData.licensing_date || null,
      insurance_renewal_date: formData.insurance_renewal_date || null,
    };

    let response;
    if (isEditing) {
      response = await supabase.from('vehicles').update(vehicleData).eq('id', vehicleToEdit.id);
    } else {
      response = await supabase.from('vehicles').insert(vehicleData);
    }

    setLoading(false);
    if (response.error) {
      setError(response.error.message);
    } else {
      onSubmitSuccess();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b dark:border-secondary-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-lg"><X size={20} className="text-gray-600 dark:text-gray-300" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Apelido (Ex: Meu Carro)" required value={formData.name} className={commonInputClasses} onChange={e => handleInputChange('name', e.target.value)} />
                <input type="text" placeholder="Marca" required value={formData.brand} className={commonInputClasses} onChange={e => handleInputChange('brand', e.target.value)} />
                <input type="text" placeholder="Modelo" required value={formData.model} className={commonInputClasses} onChange={e => handleInputChange('model', e.target.value)} />
                <input type="number" placeholder="Ano" required value={formData.year} className={commonInputClasses} onChange={e => handleInputChange('year', e.target.value)} />
                <input type="text" placeholder="Placa" required value={formData.license_plate} className={commonInputClasses} onChange={e => handleInputChange('license_plate', e.target.value)} />
                <input type="number" placeholder="Odômetro (km)" required value={formData.odometer} className={commonInputClasses} onChange={e => handleInputChange('odometer', e.target.value)} />
                <select value={formData.type} className={commonInputClasses} onChange={e => handleInputChange('type', e.target.value)}>
                  <option>Carro</option><option>Moto</option><option>Caminhão</option><option>Outro</option>
                </select>
                <select value={formData.fuel_type} className={commonInputClasses} onChange={e => handleInputChange('fuel_type', e.target.value)}>
                  <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option><option>Elétrico</option>
                </select>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Datas Importantes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venc. Licenciamento</label>
                  <input type="date" value={formData.licensing_date} className={commonInputClasses} onChange={e => handleInputChange('licensing_date', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venc. Seguro</label>
                  <input type="date" value={formData.insurance_renewal_date} className={commonInputClasses} onChange={e => handleInputChange('insurance_renewal_date', e.target.value)} />
                </div>
              </div>
            </section>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex space-x-3 pt-4 border-t dark:border-secondary-700">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Salvar Veículo')}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleForm;
