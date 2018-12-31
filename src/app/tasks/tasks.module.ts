import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorsModule } from '../editors/editors.module';
import { SharedModule } from '../shared/shared.module';
import { TasksPage } from './tasks.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    EditorsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TasksPage }]),
    SharedModule
  ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
