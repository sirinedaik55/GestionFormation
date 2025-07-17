import { Team } from './team.model';
import { User } from './user.model';

export interface Formation {
  id: number;
  name: string;
  description?: string;
  date: string;
  duree: number; // durée en heures
  equipe_id: number;
  formateur_id: number;
  room?: string;
  status?: string;
  equipe?: Team;
  formateur?: User;
  created_at?: string;
  updated_at?: string;
}