import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: { [lang in Language]: string } } = {
    // Common
    'common.loading': { en: 'Loading...', fr: 'Chargement...' },
    'common.save': { en: 'Save', fr: 'Enregistrer' },
    'common.cancel': { en: 'Cancel', fr: 'Annuler' },
    'common.delete': { en: 'Delete', fr: 'Supprimer' },
    'common.edit': { en: 'Edit', fr: 'Modifier' },
    'common.add': { en: 'Add', fr: 'Ajouter' },
    'common.search': { en: 'Search', fr: 'Rechercher' },
    'common.actions': { en: 'Actions', fr: 'Actions' },
    'common.yes': { en: 'Yes', fr: 'Oui' },
    'common.no': { en: 'No', fr: 'Non' },

    // Authentication
    'auth.login': { en: 'Login', fr: 'Connexion' },
    'auth.logout': { en: 'Logout', fr: 'Déconnexion' },
    'auth.signin': { en: 'Sign In', fr: 'Se connecter' },
    'auth.username': { en: 'Username', fr: 'Nom d\'utilisateur' },
    'auth.password': { en: 'Password', fr: 'Mot de passe' },
    'auth.email': { en: 'Email', fr: 'Email' },
    'auth.welcome': { en: 'Welcome to Formation Management', fr: 'Bienvenue dans la Gestion de Formation' },
    'auth.quickLogin': { en: 'Quick Login (Demo)', fr: 'Connexion Rapide (Démo)' },

    // Dashboard
    'dashboard.admin': { en: 'Administrator Dashboard', fr: 'Tableau de Bord Administrateur' },
    'dashboard.trainer': { en: 'Trainer Dashboard', fr: 'Tableau de Bord Formateur' },
    'dashboard.employee': { en: 'Employee Dashboard', fr: 'Tableau de Bord Employé' },
    'dashboard.welcome.admin': { en: 'Welcome to the training management system administration interface.', fr: 'Bienvenue dans l\'interface d\'administration du système de gestion de formation.' },
    'dashboard.welcome.trainer': { en: 'Welcome to your trainer space. Manage your trainings and track student progress.', fr: 'Bienvenue dans votre espace formateur. Gérez vos formations et suivez la progression de vos étudiants.' },
    'dashboard.welcome.employee': { en: 'Welcome to your personal training space.', fr: 'Bienvenue dans votre espace personnel de formation.' },

    // Statistics
    'stats.trainings': { en: 'Trainings', fr: 'Formations' },
    'stats.employees': { en: 'Employees', fr: 'Employés' },
    'stats.teams': { en: 'Teams', fr: 'Équipes' },
    'stats.trainers': { en: 'Trainers', fr: 'Formateurs' },
    'stats.attendanceRate': { en: 'Attendance Rate', fr: 'Taux de Présence' },
    'stats.upcoming': { en: 'upcoming', fr: 'à venir' },
    'stats.thisWeek': { en: 'this week', fr: 'cette semaine' },
    'stats.active': { en: 'active', fr: 'actifs' },
    'stats.specialties': { en: 'specialties', fr: 'spécialités' },
    'stats.available': { en: 'available', fr: 'disponibles' },
    'stats.forTrainings': { en: 'for trainings', fr: 'pour formations' },
    'stats.myFormations': { en: 'My Formations', fr: 'Mes Formations' },
    'stats.totalStudents': { en: 'Total Students', fr: 'Total Étudiants' },
    'stats.completedFormations': { en: 'Completed Formations', fr: 'Formations Terminées' },
    'stats.withSuccess': { en: 'with success', fr: 'avec succès' },
    'stats.activeInFormation': { en: 'active in formation', fr: 'actifs en formation' },
    'stats.averageOfMyFormations': { en: 'average of my formations', fr: 'moyenne de mes formations' },

    // Menu
    'menu.home': { en: 'HOME', fr: 'ACCUEIL' },
    'menu.dashboard': { en: 'Dashboard', fr: 'Tableau de Bord' },
    'menu.management': { en: 'MANAGEMENT', fr: 'GESTION' },
    'menu.userManagement': { en: 'User Management', fr: 'Gestion des Utilisateurs' },
    'menu.trainingManagement': { en: 'Training Management', fr: 'Gestion des Formations' },
    'menu.analytics': { en: 'ANALYTICS', fr: 'ANALYSES' },
    'menu.statistics': { en: 'Statistics', fr: 'Statistiques' },
    'menu.charts': { en: 'Charts', fr: 'Graphiques' },
    'menu.system': { en: 'SYSTEM', fr: 'SYSTÈME' },
    'menu.discussionPanel': { en: 'Discussion Panel', fr: 'Panel de Discussion' },
    'menu.documents': { en: 'Documents', fr: 'Documents' },
    'menu.reports': { en: 'Reports', fr: 'Rapports' },
    'menu.settings': { en: 'Settings', fr: 'Paramètres' },
    'menu.account': { en: 'ACCOUNT', fr: 'COMPTE' },
    'menu.profile': { en: 'Profile', fr: 'Profil' },
    'menu.help': { en: 'Help', fr: 'Aide' },

    // Trainer specific
    'menu.myFormations': { en: 'MY FORMATIONS', fr: 'MES FORMATIONS' },
    'menu.presences': { en: 'PRESENCES', fr: 'PRÉSENCES' },
    'menu.myLearning': { en: 'MY LEARNING', fr: 'MON APPRENTISSAGE' },
    'menu.formationHistory': { en: 'Formation History', fr: 'Historique des Formations' },
    'menu.resources': { en: 'RESOURCES', fr: 'RESSOURCES' },

    // Actions
    'actions.quick': { en: 'Quick Actions', fr: 'Actions Rapides' },
    'actions.newTraining': { en: 'New Training', fr: 'Nouvelle Formation' },
    'actions.manageUsers': { en: 'Manage Users', fr: 'Gérer les Utilisateurs' },
    'actions.manageTeams': { en: 'Manage Teams', fr: 'Gérer les Équipes' },
    'actions.myFormations': { en: 'My Formations', fr: 'Mes Formations' },
    'actions.presences': { en: 'Presences', fr: 'Présences' },
    'actions.documents': { en: 'Documents', fr: 'Documents' },
    'actions.reports': { en: 'Reports', fr: 'Rapports' },

    // Charts and data
    'chart.trainingsPerMonth': { en: 'Trainings per Month', fr: 'Formations par Mois' },
    'chart.upcomingFormations': { en: 'Upcoming Formations', fr: 'Formations à Venir' },

    // Debug
    'debug.currentRole': { en: 'Current Role', fr: 'Rôle Actuel' },
    'debug.user': { en: 'User', fr: 'Utilisateur' },
    'debug.noUserFound': { en: 'No user found', fr: 'Aucun utilisateur trouvé' },
    'debug.roleDetection': { en: 'User role detection in progress...', fr: 'Détection du rôle utilisateur en cours...' },

    // Roles
    'role.admin': { en: 'Admin', fr: 'Admin' },
    'role.trainer': { en: 'Trainer', fr: 'Formateur' },
    'role.employee': { en: 'Employee', fr: 'Employé' },

    // Time
    'time.thisWeek': { en: 'this week', fr: 'cette semaine' },
    'time.upcoming': { en: 'upcoming', fr: 'à venir' },
    'time.completed': { en: 'completed', fr: 'terminées' },
    'time.active': { en: 'active', fr: 'actifs' },

    // Additional dashboard texts
    'dashboard.trainingsPerMonth': { en: 'Trainings per Month', fr: 'Formations par Mois' },
    'dashboard.quickActions': { en: 'Quick Actions', fr: 'Actions Rapides' },
    'dashboard.upcomingFormations': { en: 'Upcoming Formations', fr: 'Formations à Venir' },
    'dashboard.recentActivities': { en: 'Recent Activities', fr: 'Activités Récentes' },

    // Trainer dashboard specific
    'trainer.myFormations': { en: 'My Formations', fr: 'Mes Formations' },
    'trainer.totalStudents': { en: 'Total Students', fr: 'Total Étudiants' },
    'trainer.attendanceRate': { en: 'Attendance Rate', fr: 'Taux de Présence' },
    'trainer.completedFormations': { en: 'Completed Formations', fr: 'Formations Terminées' },
    'trainer.upcomingThisWeek': { en: 'upcoming this week', fr: 'à venir cette semaine' },
    'trainer.activeInFormation': { en: 'active in formation', fr: 'actifs en formation' },
    'trainer.averageOfMyFormations': { en: 'average of my formations', fr: 'moyenne de mes formations' },
    'trainer.withSuccess': { en: 'with success', fr: 'avec succès' },

    // Employee dashboard specific
    'employee.welcome': { en: 'Welcome to your personal training space.', fr: 'Bienvenue dans votre espace personnel de formation.' },
    'employee.myLearning': { en: 'My Learning', fr: 'Mon Apprentissage' },
    'employee.myFormations': { en: 'My Formations', fr: 'Mes Formations' },
    'employee.formationHistory': { en: 'Formation History', fr: 'Historique des Formations' },

    // Form labels and buttons
    'form.name': { en: 'Name', fr: 'Nom' },
    'form.description': { en: 'Description', fr: 'Description' },
    'form.date': { en: 'Date', fr: 'Date' },
    'form.duration': { en: 'Duration', fr: 'Durée' },
    'form.participants': { en: 'Participants', fr: 'Participants' },
    'form.status': { en: 'Status', fr: 'Statut' },
    'form.room': { en: 'Room', fr: 'Salle' },
    'form.specialty': { en: 'Specialty', fr: 'Spécialité' },

    // Status
    'status.active': { en: 'Active', fr: 'Actif' },
    'status.inactive': { en: 'Inactive', fr: 'Inactif' },
    'status.pending': { en: 'Pending', fr: 'En attente' },
    'status.completed': { en: 'Completed', fr: 'Terminé' },
    'status.cancelled': { en: 'Cancelled', fr: 'Annulé' },

    // Navigation
    'nav.back': { en: 'Back', fr: 'Retour' },
    'nav.next': { en: 'Next', fr: 'Suivant' },
    'nav.previous': { en: 'Previous', fr: 'Précédent' },
    'nav.close': { en: 'Close', fr: 'Fermer' },

    // Messages
    'message.success': { en: 'Success', fr: 'Succès' },
    'message.error': { en: 'Error', fr: 'Erreur' },
    'message.warning': { en: 'Warning', fr: 'Avertissement' },
    'message.info': { en: 'Information', fr: 'Information' },
    'message.noData': { en: 'No data available', fr: 'Aucune donnée disponible' },
    'message.loading': { en: 'Loading...', fr: 'Chargement...' }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      this.currentLanguageSubject.next(savedLang);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('app-language', language);
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const translation = this.translations[key];
    
    if (translation && translation[currentLang]) {
      return translation[currentLang];
    }
    
    // Fallback to English if translation not found
    if (translation && translation['en']) {
      return translation['en'];
    }
    
    // Return key if no translation found
    console.warn(`Translation not found for key: ${key}`);
    return key;
  }

  // Helper method for templates
  t(key: string): string {
    return this.translate(key);
  }
}
