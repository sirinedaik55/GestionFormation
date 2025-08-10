// Script de débogage pour tester la redirection
console.log('=== DEBUG REDIRECTION ===');

// Test avec un utilisateur trainer
const trainerUser = {
    id: 1,
    first_name: 'Test',
    last_name: 'Trainer',
    email: 'trainer@test.com',
    role: 'formateur',
    status: 'active'
};

console.log('User role:', trainerUser.role);

// Logique de redirection
let targetRoute;
switch (trainerUser.role) {
    case 'admin':
        targetRoute = '/dashboard';
        break;
    case 'formateur':
    case 'trainer':
        targetRoute = '/dashboard/trainer';
        break;
    case 'employe':
    case 'employee':
        targetRoute = '/dashboard/employee';
        break;
    default:
        targetRoute = '/dashboard';
}

console.log('Target route:', targetRoute);
console.log('=== END DEBUG ==='); 