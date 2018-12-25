import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { CustomerEditorComponent } from './customer-editor/customer-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: CustomersPage }])
  ],
  declarations: [CustomerEditorComponent, CustomersPage],
  entryComponents: [CustomerEditorComponent]
})
export class CustomersPageModule {}
