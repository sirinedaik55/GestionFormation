export type UserRole = 'admin' | 'formateur' | 'employe';

import { Team } from './team.model';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name?: string; // computed field for display
  email: string;
  role: UserRole;
  team?: Team;
  team_id?: number;
  phone?: string;
  specialite?: string;
  created_at?: string;
  updated_at?: string;
}

export function isRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

export function getFullName(user: User): string {
  return `${user.first_name} ${user.last_name}`;
}

// Interface for creating/updating users (what we send to backend)
export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: UserRole;
  team_id?: number;
  phone?: string;
  specialite?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  team_id?: number;
  phone?: string;
  specialite?: string;
}
