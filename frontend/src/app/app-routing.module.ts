import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { GuestGuard } from './guards/guest.guard';
import { KeycloakAuthGuard } from './guards/keycloak-auth.guard';
import { TestComponent } from './test.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: '/auth/login',
                pathMatch: 'full'
            },
            {
                path: 'test',
                component: TestComponent
            },
            {
                path: 'auth-debug',
                loadComponent: () => import('./auth-debug.component').then(c => c.AuthDebugComponent)
            },
            {
                path: 'dashboard',
                component: AppLayoutComponent,
                canActivate: [KeycloakAuthGuard], // RE-ENABLED (but guard always returns true)
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                    {
                        path: 'uikit',
                        loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule),
                        canActivate: [KeycloakAuthGuard], // RE-ENABLED (but guard always returns true)
                        data: { roles: ['admin'] }
                    },
                    {
                        path: 'trainer',
                        loadChildren: () => import('./demo/components/Trainers/trainer.module').then(m => m.TrainerModule),
                        canActivate: [KeycloakAuthGuard], // RE-ENABLED (but guard always returns true)
                        data: { roles: ['formateur', 'trainer'] }
                    },
                    {
                        path: 'employee',
                        loadChildren: () => import('./demo/components/Employee/employee.module').then(m => m.EmployeeModule),
                        canActivate: [KeycloakAuthGuard], // RE-ENABLED (but guard always returns true)
                        data: { roles: ['employe', 'employee'] }
                    }
                ],
            },
            {
                path: 'auth',
                loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule)
            },
            {
                path: 'unauthorized',
                loadChildren: () => import('./demo/components/auth/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
            },
            { path: '**', redirectTo: '/auth/login' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
