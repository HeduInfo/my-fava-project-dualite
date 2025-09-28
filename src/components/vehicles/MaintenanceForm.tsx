import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface MaintenanceFormProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ vehicle, onClose, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    type: '',
    cost: '',
    provider: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: queryError } = await supabase.from('vehicle_maintenances').insert({
      vehicle_id: vehicle.id,
      date: formData.date,
      odometer: Number(formData.odometer),
      type: formData.type,
      cost: parseFloat(formData.cost),
      provider: formData.provider || null,
      notes: formData.notes || null,
    });

    setLoading(false);
    if (queryError) {
      setError(queryError.message);
    } else {
      onSubmitSuccess();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const maintenanceTypes = ['Troca de Óleo', 'Revisão', 'Troca de Pneus', 'Freios', 'Alinhamento/Balanceamento', 'Outro'];
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
          className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b dark:border-secondary-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Registrar Manutenção</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-lg"><X size={20} className="text-gray-600 dark:text-gray-300" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input type="date" value={formData.date} className={commonInputClasses} onChange={e => handleInputChange('date', e.target.value)} />
            <input type="number" placeholder="Odômetro (km)" required value={formData.odometer} className={commonInputClasses} onChange={e => handleInputChange('odometer', e.target.value)} />
            <select required value={formData.type} className={commonInputClasses} onChange={e => handleInputChange('type', e.target.value)}>
              <option value="">Tipo de Serviço</option>
              {maintenanceTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Custo Total" required value={formData.cost} className={commonInputClasses} onChange={e => handleInputChange('cost', e.target.value)} />
            <input type="text" placeholder="Prestador de Serviço (Opcional)" value={formData.provider} className={commonInputClasses} onChange={e => handleInputChange('provider', e.target.value)} />
            <textarea placeholder="Notas Adicionais" rows={3} value={formData.notes} className={`${commonInputClasses} resize-none`} onChange={e => handleInputChange('notes', e.target.value)} />
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaintenanceForm;
