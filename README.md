# 📘 Gestion des Formations

## 🧠 Objectif de l'application
Cette application permet à une société de :
- Organiser et centraliser les **formations internes**.
- Gérer les utilisateurs selon leur rôle (**Admin**, **Formateur**, **Employé**).
- Suivre les **présences des employés** par session.
- Archiver les formations passées et planifiées.

---

## 👥 Types d'utilisateurs et leurs responsabilités

### 🔑 1. Admin
Rôle principal : **gestion centralisée** des comptes, des formations, et des équipes.  
Fonctionnalités :
- CRUD (ajouter / modifier / supprimer) sur les **employés** et **formateurs**.
- Créer des équipes spécialisées (Développement, UI/UX, Sécurité...).
- Affecter des employés à une équipe.
- Créer / programmer des formations (équipe concernée, date, durée, formateur...).
- Consulter les présences et statistiques globales.
- Générer des rapports (.pdf / .csv).

### 🧑‍🏫 2. Formateur
Rôle principal : **animer une formation** et assurer le suivi pédagogique.  
Fonctionnalités :
- Visualiser ses formations à venir et passées.
- Voir la liste des participants attendus.
- Marquer la présence des employés.
- Ajouter des documents ou ressources pédagogiques.
- Rédiger un bilan de formation (feedback).

### 👨‍💻 3. Employé
Rôle principal : **suivre son parcours de formation**.  
Fonctionnalités :
- Voir son profil et son équipe.
- Consulter son planning des formations.
- Télécharger les documents d’une formation.
- Visualiser son historique de participation.
- Consulter les bilans laissés par les formateurs.

---

## 🖥️ Interfaces proposées

### 🔐 Interface de connexion
- Authentification par **Email / Mot de passe**.
- Redirection automatique selon rôle (Admin, Formateur, Employé).

### 🏠 Tableau de bord
- **Admin** : statistiques globales, formations programmées, gestion rapide des utilisateurs et formations.
- **Formateur** : mes formations (à venir et passées), feuille de présence, documents, bilans.
- **Employé** : prochaines formations, statistiques personnelles, historique.

---

## 📅 Modules fonctionnels

### 📋 Gestion des Formations (Admin)
- Ajouter, modifier ou supprimer une formation.
- Affecter des employés automatiquement selon leur équipe.

### 🧑‍💼 Gestion des Utilisateurs (Admin)
- CRUD sur **Employés** et **Formateurs**.
- Affecter un employé à une équipe.

### 📝 Gestion des Présences (Formateur)
- Liste des participants attendus.
- Marquer présence / absence par case à cocher.
- Validation envoyée à l’Admin.

### 📁 Documents
- **Formateur** : upload de ressources pédagogiques.
- **Employé** : téléchargement des documents disponibles.

### 📊 Statistiques (Admin)
- Taux de présence par équipe ou formation.
- Nombre total de formations réalisées.
- Liste des absents fréquents.
- Export en **PDF** ou **CSV**.

---

## 🚀 Stack technique (prévisionnelle)
- **Backend** : Spring Boot (Java)
- **Frontend** : Angular
- **Base de données** : MySQL
- **Sécurité** : JWT Authentication
- **Export** : ReportLab / Apache POI pour PDF et CSV

---
