import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjectsPage } from './projects.page';
import { EditorsModule } from '@app/editors';

@NgModule({
  imports: [
    CommonModule,
    EditorsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ProjectsPage }]),
  ],
  declarations: [ProjectsPage],
})
export class ProjectsPageModule {}
