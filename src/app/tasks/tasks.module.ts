import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorsModule } from '../editors/editors.module';
import { SharedModule } from '../shared/shared.module';
import { TasksPage } from './tasks.page';

const routes: Routes = [
  {
    path: '',
    component: TasksPage
  },
  {
    path: ':customerId',
    component: TasksPage
  },
  {
    path: ':customerId/:status',
    component: TasksPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    EditorsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
