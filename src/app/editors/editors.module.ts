import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerEditorComponent } from './customer-editor/customer-editor.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [CustomerEditorComponent, TaskEditorComponent],
  entryComponents: [CustomerEditorComponent, TaskEditorComponent]
})
export class EditorsModule {}
