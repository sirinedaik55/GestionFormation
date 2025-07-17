# 🔧 Guide de Dépannage - "Failed to Save"

## 🚀 Étapes de Diagnostic Rapide

### 1. Exécuter le Diagnostic Automatique
```bash
# Double-cliquez sur ce fichier ou exécutez dans le terminal :
diagnose-all.bat
```

### 2. Vérifications Manuelles

#### ✅ Backend (Laravel)
1. **Serveur démarré ?**
   ```bash
   cd backend
   php artisan serve
   ```
   ➡️ Doit afficher : `Laravel development server started: http://127.0.0.1:8000`

2. **Migration exécutée ?**
   ```bash
   cd backend
   php artisan migrate
   ```

3. **Test API direct :**
   ```bash
   curl -X GET "http://localhost:8000/api/users?role=formateur"
   ```

#### ✅ Frontend (Angular)
1. **Serveur démarré avec proxy ?**
   ```bash
   cd frontend
   ng serve --proxy-config proxy.conf.json
   ```

2. **Console navigateur :** Ouvrir F12 → Console → Chercher erreurs rouges

### 3. Problèmes Courants et Solutions

#### ❌ "Connection refused" ou "Network Error"
**Cause :** Backend pas démarré
**Solution :**
```bash
cd backend
php artisan serve
```

#### ❌ "Column 'specialite' doesn't exist"
**Cause :** Migration pas exécutée
**Solution :**
```bash
cd backend
php artisan migrate
```

#### ❌ "CORS Error"
**Cause :** Problème de configuration CORS
**Solution :** Vérifier `backend/config/cors.php` - doit contenir :
```php
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
```

#### ❌ "422 Validation Error"
**Cause :** Données invalides envoyées
**Solution :** Vérifier que tous les champs requis sont remplis :
- First Name ✅
- Last Name ✅  
- Email ✅ (format valide)

#### ❌ "500 Internal Server Error"
**Cause :** Erreur serveur Laravel
**Solution :** Vérifier les logs :
```bash
cd backend
tail -f storage/logs/laravel.log
```

### 4. Tests de Validation

#### Test 1: API Backend
Ouvrir `test-trainer-api.html` dans le navigateur

#### Test 2: Frontend Debug
Ouvrir `debug-frontend.html` dans le navigateur

#### Test 3: Création Manuelle
```bash
cd backend
php artisan tinker
```
```php
$user = new App\Models\User();
$user->first_name = 'Test';
$user->last_name = 'User';
$user->email = 'test@example.com';
$user->password = bcrypt('password');
$user->role = 'formateur';
$user->specialite = 'Web Dev';
$user->save();
echo "User created with ID: " . $user->id;
```

### 5. Configuration Requise

#### Base de Données
- MySQL/MariaDB démarré
- Base de données créée
- Fichier `.env` configuré correctement

#### Ports
- Backend : `http://localhost:8000`
- Frontend : `http://localhost:4200`

### 6. Commandes de Réinitialisation

Si tout échoue, réinitialiser complètement :

```bash
# Backend
cd backend
php artisan migrate:fresh
php artisan db:seed
php artisan serve

# Frontend (nouveau terminal)
cd frontend
npm install
ng serve --proxy-config proxy.conf.json
```

### 7. Logs à Vérifier

1. **Laravel Logs :** `backend/storage/logs/laravel.log`
2. **Console Navigateur :** F12 → Console
3. **Network Tab :** F12 → Network → Voir requêtes HTTP

---

## 📞 Support

Si le problème persiste après ces étapes :
1. Exécuter `diagnose-all.bat`
2. Prendre des captures d'écran des erreurs
3. Copier les logs d'erreur
4. Fournir ces informations pour un diagnostic plus poussé
