import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerEditorComponent } from './customer-editor/customer-editor.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    CustomerEditorComponent,
    NoteEditorComponent,
    TaskEditorComponent
  ],
  entryComponents: [
    CustomerEditorComponent,
    NoteEditorComponent,
    TaskEditorComponent
  ]
})
export class EditorsModule {}
