import { Injectable } from '@angular/core';
import { User } from './user.service';
import { Team } from './team.service';
import { Formation } from './formation.service';

@Injectable({
    providedIn: 'root'
})
export class MockStorageService {
    private users: User[] = [];
    private teams: Team[] = [];
    private formations: Formation[] = [];
    private initialized = false;

    constructor() {
        this.initializeData();
    }

    private initializeData() {
        if (this.initialized) return;

        // Initialize mock users
        this.users = [
            // Employees
            {
                id: 1,
                first_name: 'Jean',
                last_name: 'Dupont',
                email: 'jean.dupont@formation.com',
                role: 'employe',
                phone: '+33123456789',
                status: 'active',
                team_id: 1,
                team: { id: 1, name: 'Développement Web', speciality: 'Frontend' }
            },
            {
                id: 2,
                first_name: 'Marie',
                last_name: 'Martin',
                email: 'marie.martin@formation.com',
                role: 'employe',
                phone: '+33123456790',
                status: 'active',
                team_id: 2,
                team: { id: 2, name: 'UI/UX Design', speciality: 'Design' }
            },
            {
                id: 3,
                first_name: 'Pierre',
                last_name: 'Bernard',
                email: 'pierre.bernard@formation.com',
                role: 'employe',
                phone: '+33123456791',
                status: 'active',
                team_id: 3,
                team: { id: 3, name: 'Sécurité Informatique', speciality: 'Security' }
            },
            // Trainers
            {
                id: 4,
                first_name: 'Marie',
                last_name: 'Dubois',
                email: 'marie.dubois@formation.com',
                role: 'formateur',
                phone: '+33123456792',
                status: 'active',
                specialite: 'Angular & TypeScript',
                room: 'Salle A'
            },
            {
                id: 5,
                first_name: 'Pierre',
                last_name: 'Martin',
                email: 'pierre.martin@formation.com',
                role: 'formateur',
                phone: '+33123456793',
                status: 'active',
                specialite: 'Laravel & PHP',
                room: 'Salle B'
            },
            {
                id: 6,
                first_name: 'Sophie',
                last_name: 'Bernard',
                email: 'sophie.bernard@formation.com',
                role: 'formateur',
                phone: '+33123456794',
                status: 'active',
                specialite: 'UI/UX Design',
                room: 'Salle C'
            }
        ];

        // Initialize mock teams
        this.teams = [
            {
                id: 1,
                name: 'Développement Web',
                speciality: 'Frontend',
                memberCount: 5,
                formationCount: 3,
                members: [
                    { id: 1, first_name: 'Jean', last_name: 'Dupont', email: 'jean.dupont@formation.com', role: 'employe' },
                    { id: 2, first_name: 'Marie', last_name: 'Martin', email: 'marie.martin@formation.com', role: 'employe' }
                ],
                formations: [
                    { id: 1, name: 'Angular Avancé', date: '2025-08-15', status: 'upcoming' },
                    { id: 2, name: 'TypeScript', date: '2025-07-20', status: 'completed' }
                ]
            },
            {
                id: 2,
                name: 'UI/UX Design',
                speciality: 'Design',
                memberCount: 3,
                formationCount: 2,
                members: [
                    { id: 3, first_name: 'Pierre', last_name: 'Bernard', email: 'pierre.bernard@formation.com', role: 'employe' }
                ],
                formations: [
                    { id: 3, name: 'Figma Avancé', date: '2025-08-20', status: 'upcoming' }
                ]
            },
            {
                id: 3,
                name: 'Sécurité Informatique',
                speciality: 'Security',
                memberCount: 4,
                formationCount: 1,
                members: [
                    { id: 4, first_name: 'Sophie', last_name: 'Durand', email: 'sophie.durand@formation.com', role: 'employe' }
                ],
                formations: [
                    { id: 4, name: 'Cybersécurité', date: '2025-09-01', status: 'upcoming' }
                ]
            },
            {
                id: 4,
                name: 'Data Science',
                speciality: 'Analytics',
                memberCount: 2,
                formationCount: 2,
                members: [],
                formations: []
            },
            {
                id: 5,
                name: 'DevOps',
                speciality: 'Infrastructure',
                memberCount: 3,
                formationCount: 1,
                members: [],
                formations: []
            }
        ];

        // Initialize mock formations
        this.formations = [
            {
                id: 1,
                name: 'Formation Angular Avancé',
                description: 'Formation approfondie sur Angular 14+',
                date: '2025-08-15',
                duree: 3,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Salle A',
                status: 'upcoming',
                team: { id: 1, name: 'Développement Web', speciality: 'Frontend' },
                trainer: { id: 1, first_name: 'Marie', last_name: 'Dubois', email: 'marie.dubois@formation.com' },
                participantCount: 5,
                attendanceRate: 90
            },
            {
                id: 2,
                name: 'Formation Laravel & PHP',
                description: 'Développement backend avec Laravel',
                date: '2025-08-20',
                duree: 5,
                equipe_id: 1,
                formateur_id: 2,
                room: 'Salle B',
                status: 'upcoming',
                team: { id: 1, name: 'Développement Web', speciality: 'Frontend' },
                trainer: { id: 2, first_name: 'Pierre', last_name: 'Martin', email: 'pierre.martin@formation.com' },
                participantCount: 4,
                attendanceRate: 85
            },
            {
                id: 3,
                name: 'Formation UI/UX Design',
                description: 'Principes de design et expérience utilisateur',
                date: '2025-08-25',
                duree: 2,
                equipe_id: 2,
                formateur_id: 3,
                room: 'Salle C',
                status: 'completed',
                team: { id: 2, name: 'UI/UX Design', speciality: 'Design' },
                trainer: { id: 3, first_name: 'Sophie', last_name: 'Bernard', email: 'sophie.bernard@formation.com' },
                participantCount: 3,
                attendanceRate: 100
            },
            {
                id: 4,
                name: 'Formation Sécurité Web',
                description: 'Sécurisation des applications web',
                date: '2025-09-10',
                duree: 2,
                equipe_id: 3,
                formateur_id: 4,
                room: 'Salle D',
                status: 'cancelled',
                team: { id: 3, name: 'Sécurité Informatique', speciality: 'Security' },
                trainer: { id: 4, first_name: 'Thomas', last_name: 'Leroy', email: 'thomas.leroy@formation.com' },
                participantCount: 2,
                attendanceRate: 0
            }
        ];

        this.initialized = true;
        console.log('Mock storage initialized with:', {
            users: this.users.length,
            teams: this.teams.length,
            formations: this.formations.length
        });
    }

    // User methods
    getUsers(): User[] {
        return [...this.users];
    }

    getUsersByRole(role: string): User[] {
        return this.users.filter(user => user.role === role);
    }

    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    addUser(user: Omit<User, 'id'>): User {
        const newUser = { ...user, id: this.getNextUserId() } as User;
        this.users.push(newUser);
        console.log('User added to mock storage:', newUser);
        return newUser;
    }

    updateUser(id: number, userData: Partial<User>): User | null {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData };
            console.log('User updated in mock storage:', this.users[index]);
            return this.users[index];
        }
        return null;
    }

    deleteUser(id: number): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            console.log('User deleted from mock storage:', id);
            return true;
        }
        return false;
    }

    // Team methods
    getTeams(): Team[] {
        return [...this.teams];
    }

    getTeamById(id: number): Team | undefined {
        return this.teams.find(team => team.id === id);
    }

    addTeam(team: Omit<Team, 'id'>): Team {
        const newTeam = { ...team, id: this.getNextTeamId() } as Team;
        this.teams.push(newTeam);
        console.log('Team added to mock storage:', newTeam);
        return newTeam;
    }

    updateTeam(id: number, teamData: Partial<Team>): Team | null {
        const index = this.teams.findIndex(team => team.id === id);
        if (index !== -1) {
            this.teams[index] = { ...this.teams[index], ...teamData };
            console.log('Team updated in mock storage:', this.teams[index]);
            return this.teams[index];
        }
        return null;
    }

    deleteTeam(id: number): boolean {
        const index = this.teams.findIndex(team => team.id === id);
        if (index !== -1) {
            this.teams.splice(index, 1);
            console.log('Team deleted from mock storage:', id);
            return true;
        }
        return false;
    }

    // Formation methods
    getFormations(): Formation[] {
        return [...this.formations];
    }

    getFormationById(id: number): Formation | undefined {
        return this.formations.find(formation => formation.id === id);
    }

    addFormation(formation: Omit<Formation, 'id'>): Formation {
        const newFormation = { ...formation, id: this.getNextFormationId() } as Formation;
        this.formations.push(newFormation);
        console.log('Formation added to mock storage:', newFormation);
        return newFormation;
    }

    updateFormation(id: number, formationData: Partial<Formation>): Formation | null {
        const index = this.formations.findIndex(formation => formation.id === id);
        if (index !== -1) {
            this.formations[index] = { ...this.formations[index], ...formationData };
            console.log('Formation updated in mock storage:', this.formations[index]);
            return this.formations[index];
        }
        return null;
    }

    deleteFormation(id: number): boolean {
        const index = this.formations.findIndex(formation => formation.id === id);
        if (index !== -1) {
            this.formations.splice(index, 1);
            console.log('Formation deleted from mock storage:', id);
            return true;
        }
        return false;
    }

    // Helper methods for generating IDs
    private getNextUserId(): number {
        return Math.max(...this.users.map(u => u.id), 0) + 1;
    }

    private getNextTeamId(): number {
        return Math.max(...this.teams.map(t => t.id), 0) + 1;
    }

    private getNextFormationId(): number {
        return Math.max(...this.formations.map(f => f.id), 0) + 1;
    }
}
