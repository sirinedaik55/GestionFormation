import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { GuestGuard } from './guards/guest.guard';

import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: AppLayoutComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule),
                        canActivate: [RoleGuard],
                        data: { roles: ['admin'] }
                    },
                    {
                        path: 'uikit',
                        loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule),
                        canActivate: [RoleGuard],
                        data: { roles: ['admin'] }
                    },
                    // TODO: Create trainer and employee modules
                    // {
                    //     path: 'trainer',
                    //     loadChildren: () => import('./demo/components/trainer/trainer.module').then(m => m.TrainerModule),
                    //     canActivate: [RoleGuard],
                    //     data: { roles: ['trainer'] }
                    // },
                    // {
                    //     path: 'employee',
                    //     loadChildren: () => import('./demo/components/employee/employee.module').then(m => m.EmployeeModule),
                    //     canActivate: [RoleGuard],
                    //     data: { roles: ['employee'] }
                    // }
                ],
            },
            {
                path: 'auth',
                loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule),
                canActivate: [GuestGuard]
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
