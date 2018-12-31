import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { firestore } from 'firebase/app';

import { CustomersService } from '../../services/customers/customers.service';
import { priorities, statuses, taskTypes } from '../../default-data';
import { Task, TaskWithId } from '../../models/task';
import { TasksService } from '../../services/tasks/tasks.service';

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

    this.title = 'Add Task';
    this.priority = this.priorities[1];
    this.status = this.statuses[0];
    this.taskType = this.taskTypes[0];

    this.customerSubscription = this.customers.all().subscribe(customers => {
      this.activeCustomers = customers
        .filter(c => c.isActive)
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
    await this.tasks.add(this.taskObject());
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
      enteredOn: new firestore.Timestamp(this.getSeconds(), 0),
      customer: {
        id: this.customerId,
        name: customer && customer.name
      }
    };

    if (this.dueDate) {
      task.dueDate = this.dueDate;
    }

    return task;
  }

  private getSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
