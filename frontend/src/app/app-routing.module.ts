import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: AppLayoutComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule)
                    },
                    {
                        path: 'uikit',
                        loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule)
                    },
                    {
                        path: 'trainer',
                        loadChildren: () => import('./demo/components/Trainers/trainer.module').then(m => m.TrainerModule)
                    },
                    {
                        path: 'employee',
                        loadChildren: () => import('./demo/components/Employee/employee.module').then(m => m.EmployeeModule)
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
