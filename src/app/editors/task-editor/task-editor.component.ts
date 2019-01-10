import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { CustomersService } from '../../services/firestore-data/customers/customers.service';
import {
  Priorities,
  priorities,
  Statuses,
  statuses,
  TaskTypes,
  taskTypes
} from '../../default-data';
import { Task, TaskWithId } from '../../models/task';
import { TasksService } from '../../services/firestore-data/tasks/tasks.service';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit, OnDestroy {
  title: string;

  customerId: string;
  description: string;
  dueDate: string;
  name: string;
  priority: string;
  status: string;
  taskType: string;

  task: TaskWithId;

  activeCustomers: Array<{ id: string; name: string }>;
  priorities: Array<string>;
  statuses: Array<string>;
  taskTypes: Array<string>;

  errorMessage: string;
  warningMessage: string;

  customerSubscription: Subscription;

  constructor(
    private customers: CustomersService,
    private modal: ModalController,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.priorities = [...priorities];
    this.statuses = [...statuses];
    this.taskTypes = [...taskTypes];

    if (this.task) {
      this.title = 'Modify Task';
      this.name = this.task.name;
      this.description = this.task.description;
      this.status = this.task.status;
      this.priority = this.task.priority;
      this.taskType = this.task.type;
      this.dueDate = this.task.dueDate;
      this.customerId = this.task.customerId;
    } else {
      this.title = 'Add New Task';
      this.priority = Priorities.Normal;
      this.status = Statuses.Open;
      this.taskType = TaskTypes.FollowUp;
    }

    this.customerSubscription = this.customers.all().subscribe(customers => {
      this.activeCustomers = customers
        .filter(
          c => c.isActive || (this.task && this.task.customerId === c.id)
        )
        .map(c => ({ id: c.id, name: c.name }));
    });
  }

  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  async save() {
    if (this.task) {
      await this.tasks.update(this.taskObject() as TaskWithId);
    } else {
      await this.tasks.add(this.taskObject());
    }
    this.modal.dismiss();
  }

  private taskObject(): Task | TaskWithId {
    const customer = this.activeCustomers.find(c => c.id === this.customerId);
    const task: Task = {
      name: this.name,
      description: this.description,
      status: this.status,
      type: this.taskType,
      priority: this.priority,
      enteredOn:
        (this.task && this.task.enteredOn) ||
        new firestore.Timestamp(this.getSeconds(), 0),
      customerId: this.customerId,
      customerName: customer && customer.name
    };

    if (this.dueDate) {
      task.dueDate = this.dueDate;
    }

    if (this.task) {
      (task as TaskWithId).id = this.task.id;
    }

    return task;
  }

  private getSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
