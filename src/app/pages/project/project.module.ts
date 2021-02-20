import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectPage } from './project.page';
import { EditorsModule } from '@app/editors';
import { SharedModule } from '@app/shared';
import { AuthGuardService } from '@app/services';

const routes: Routes = [
  {
    path: '',
    component: ProjectPage,
  },
  {
    path: 'tasks',
    children: [
      {
        path: '',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: ':status',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: 'task/:taskId',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../task/task.module').then((m) => m.TaskPageModule),
      },
      {
        path: ':status/task/:taskId',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../task/task.module').then((m) => m.TaskPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, EditorsModule, FormsModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ProjectPage],
})
export class ProjectPageModule {}
