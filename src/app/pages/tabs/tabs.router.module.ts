import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '@app/services';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        children: [
          {
            path: '',
            canActivate: [AuthGuardService],
            loadChildren: () => import('../tasks/tasks.module').then((m) => m.TasksPageModule),
          },
          {
            path: ':taskId',
            canActivate: [AuthGuardService],
            loadChildren: () => import('../task/task.module').then((m) => m.TaskPageModule),
          },
        ],
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            canActivate: [AuthGuardService],
            loadChildren: () => import('../projects/projects.module').then((m) => m.ProjectsPageModule),
          },
          {
            path: ':projectId',
            canActivate: [AuthGuardService],
            loadChildren: () => import('../project/project.module').then((m) => m.ProjectPageModule),
          },
        ],
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then((m) => m.AboutPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tasks',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
