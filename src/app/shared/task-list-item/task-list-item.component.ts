import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TaskWithId } from '../../models/task';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent {
  @Input() task: TaskWithId;
  @Output() delete: EventEmitter<void>;
  @Output() view: EventEmitter<void>;

  constructor() {
    this.delete = new EventEmitter();
    this.view = new EventEmitter();
  }
}
