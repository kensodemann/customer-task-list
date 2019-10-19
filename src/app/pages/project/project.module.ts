import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectPage } from './project.page';
import { EditorsModule } from '@app/editors';
import { SharedModule } from '@app/shared';

const routes: Routes = [
  {
    path: ':id',
    component: ProjectPage
  }
];

@NgModule({
  imports: [CommonModule, EditorsModule, FormsModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ProjectPage]
})
export class ProjectPageModule {}
