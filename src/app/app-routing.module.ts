import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'customer',
    canActivate: [AuthGuardService],
    loadChildren: './customer/customer.module#CustomerPageModule'
  },
  {
    path: 'task',
    canActivate: [AuthGuardService],
    loadChildren: './task/task.module#TaskPageModule'
  },
  {
    path: 'tasks',
    canActivate: [AuthGuardService],
    loadChildren: './tasks/tasks.module#TasksPageModule'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
