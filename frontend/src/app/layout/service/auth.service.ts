import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Simulate getting the role from localStorage or a JWT
  getRole(): 'ADMIN' | 'FORMATEUR' | 'EMPLOYE' | 'GUEST' {
    return (localStorage.getItem('role') as 'ADMIN' | 'FORMATEUR' | 'EMPLOYE' | 'GUEST') || 'GUEST';
  }

  setRole(role: 'ADMIN' | 'FORMATEUR' | 'EMPLOYE' | 'GUEST') {
    localStorage.setItem('role', role);
  }

  clearRole() {
    localStorage.removeItem('role');
  }
}
