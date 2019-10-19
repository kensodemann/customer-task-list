import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  {
    path: 'project',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectPageModule)
  },
  {
    path: 'task',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/task/task.module').then(m => m.TaskPageModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
