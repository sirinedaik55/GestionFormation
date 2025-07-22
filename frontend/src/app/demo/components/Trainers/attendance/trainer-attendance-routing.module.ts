import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerAttendanceComponent } from './trainer-attendance.component';
import { AttendanceHistoryComponent } from './history/attendance-history.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerAttendanceComponent,
        data: { breadcrumb: 'Take Attendance' }
    },
    {
        path: 'history',
        component: AttendanceHistoryComponent,
        data: { breadcrumb: 'Attendance History' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerAttendanceRoutingModule { }
