import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjectEditorComponent } from './project-editor/project-editor.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ProjectEditorComponent, NoteEditorComponent, TaskEditorComponent],
  entryComponents: [ProjectEditorComponent, NoteEditorComponent, TaskEditorComponent]
})
export class EditorsModule {}
