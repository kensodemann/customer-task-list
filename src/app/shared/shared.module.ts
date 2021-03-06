import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TaskListItemComponent } from './task-list-item/task-list-item.component';
import { NoteListItemComponent } from './note-list-item/note-list-item.component';
import { NotesListComponent } from './notes-list/notes-list.component';

@NgModule({
  declarations: [
    NoteListItemComponent,
    NotesListComponent,
    TaskListItemComponent,
  ],
  exports: [NoteListItemComponent, NotesListComponent, TaskListItemComponent],
  imports: [CommonModule, IonicModule],
})
export class SharedModule {}
