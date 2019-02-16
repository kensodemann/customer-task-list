import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { EditorsModule } from '../../editors/editors.module';

@NgModule({
  imports: [
    CommonModule,
    EditorsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: CustomersPage }])
  ],
  declarations: [CustomersPage]
})
export class CustomersPageModule {}
