import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TaskListItemComponent } from './task-list-item/task-list-item.component';
import { NoteListItemComponent } from './note-list-item/note-list-item.component';

@NgModule({
  declarations: [NoteListItemComponent, TaskListItemComponent],
  exports: [NoteListItemComponent, TaskListItemComponent],
  imports: [CommonModule, IonicModule]
})
export class SharedModule {}
