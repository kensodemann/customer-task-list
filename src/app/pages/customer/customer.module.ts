import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomerPage } from './customer.page';
import { EditorsModule } from '../../editors/editors.module';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: ':id',
    component: CustomerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    EditorsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [CustomerPage]
})
export class CustomerPageModule {}
