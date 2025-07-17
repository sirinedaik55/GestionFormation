import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutComponent } from './logout.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: LogoutComponent }
  ])],
  exports: [RouterModule]
})
export class LogoutRoutingModule { }
