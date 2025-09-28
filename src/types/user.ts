export type UserRole = 'Administrador' | 'Lançador' | 'Somente Leitura';
export type UserStatus = 'Ativo' | 'Inativo';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
}
