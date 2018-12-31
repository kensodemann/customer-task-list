import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListItemComponent } from './task-list-item/task-list-item.component';

@NgModule({
  declarations: [TaskListItemComponent],
  exports: [TaskListItemComponent],
  imports: [CommonModule]
})
export class SharedModule {}
