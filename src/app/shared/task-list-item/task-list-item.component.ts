import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Statuses } from '@app/default-data';
import { Task } from '@app/models';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
})
export class TaskListItemComponent {
  @Input() task: Task;
  @Output() done: EventEmitter<void>;
  @Output() delete: EventEmitter<void>;
  @Output() view: EventEmitter<void>;

  constructor() {
    this.done = new EventEmitter();
    this.delete = new EventEmitter();
    this.view = new EventEmitter();
  }

  get showClosed(): boolean {
    return this.task.status !== Statuses.closed;
  }
}
