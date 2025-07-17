import { UserRole } from '../../models/user.model';

// Ajoute les propriétés dynamiques au modèle User pour le template
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  team?: string;
  specialite?: string;
  // autres champs si besoin
}
