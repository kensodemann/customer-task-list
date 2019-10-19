import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  {
    path: 'customer',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/customer/customer.module').then(m => m.CustomerPageModule)
  },
  {
    path: 'task',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/task/task.module').then(m => m.TaskPageModule)
  },
  {
    path: 'tasks',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
