import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Profile } from '../../types/database.types';
import { UserRole } from '../../types/user';

const UserSettings: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      if (data) {
        setUsers(data);
      }
      if (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string | null) => {
    const roleMap: { [key: string]: string } = {
      'Administrador': 'bg-red-100 text-red-700',
      'Lançador': 'bg-blue-100 text-blue-700',
      'Somente Leitura': 'bg-gray-100 text-gray-700'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${roleMap[role || ''] || 'bg-gray-100 text-gray-700'}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold text-gray-900">Gerenciamento de Usuários</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2 text-sm"
        >
          <Plus size={16} />
          <span>Convidar Usuário</span>
        </motion.button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="divide-y">
          {users.map(user => (
            <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <img src={user.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name || 'Avatar'} className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">ID: ...{user.id.slice(-6)}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <span className={getRoleBadge(user.role)}>{user.role || 'Indefinido'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSettings;
