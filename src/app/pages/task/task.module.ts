import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditorsModule } from '@app/editors';
import { SharedModule } from '@app/shared';
import { TaskPage } from './task.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    EditorsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [TaskPage],
})
export class TaskPageModule {}
