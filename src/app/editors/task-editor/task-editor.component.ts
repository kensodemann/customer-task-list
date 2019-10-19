import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { addDays, addYears, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { firestore } from 'firebase/app';

import { byName } from '../../util';
import { CustomersService } from '../../services/firestore-data/customers/customers.service';
import { Priorities, priorities, Statuses, statuses, TaskTypes, taskTypes } from '../../default-data';
import { Task, TaskWithId } from '../../models/task';
import { TasksService } from '../../services/firestore-data/tasks/tasks.service';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit, OnDestroy {
  private daysBetween;

  title: string;

  customerId: string;
  description: string;
  beginDate: string;
  endDate: string;
  maxDate: string;
  name: string;
  priority: string;
  schedule: boolean;
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

  constructor(private customers: CustomersService, private modal: ModalController, private tasks: TasksService) {}

  ngOnInit() {
    this.priorities = [...priorities];
    this.statuses = [...statuses];
    this.taskTypes = [...taskTypes];
    this.maxDate = format(addYears(new Date(), 3), 'yyyy-MM-dd');

    if (this.task) {
      this.title = 'Modify Task';
      this.copyTaskProperties();
    } else {
      this.title = 'Add New Task';
      this.defaultTaskProperties();
    }

    this.customerSubscription = this.customers.all().subscribe(customers => {
      this.activeCustomers = customers
        .filter(c => c.isActive || (this.task && this.task.customerId === c.id))
        .map(c => ({ id: c.id, name: c.name }))
        .sort(byName);
    });
  }

  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  save() {
    if (this.task) {
      this.tasks.update(this.taskObject() as TaskWithId);
    } else {
      this.tasks.add(this.taskObject());
    }
    this.modal.dismiss();
  }

  scheduleChanged() {
    if (this.schedule) {
      this.initializeDates();
    } else {
      this.clearDates();
    }
  }

  beginDateChanged() {
    this.endDate = format(addDays(parseISO(this.beginDate), this.daysBetween), 'yyyy-MM-dd');
  }

  endDateChanged() {
    this.daysBetween = differenceInCalendarDays(parseISO(this.endDate), parseISO(this.beginDate));
  }

  private copyTaskProperties() {
    this.name = this.task.name;
    this.description = this.task.description;
    this.status = this.task.status;
    this.priority = this.task.priority;
    this.taskType = this.task.type;
    this.customerId = this.task.customerId;
    this.schedule = !!this.task.beginDate;
    this.beginDate = this.task.beginDate;
    this.endDate = this.task.endDate;
    this.daysBetween =
      this.beginDate && this.endDate ? differenceInCalendarDays(parseISO(this.endDate), parseISO(this.beginDate)) : 0;
  }

  private clearDates() {
    this.beginDate = undefined;
    this.endDate = undefined;
  }

  private initializeDates() {
    this.beginDate = (this.task && this.task.beginDate) || this.today();
    this.endDate = (this.task && this.task.endDate) || this.today();
    this.daysBetween = differenceInCalendarDays(parseISO(this.endDate), parseISO(this.beginDate));
  }

  private today(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  private defaultTaskProperties() {
    this.priority = Priorities.Normal;
    this.status = Statuses.Open;
    this.taskType = TaskTypes.FollowUp;
  }

  private taskObject(): Task | TaskWithId {
    const customer = this.activeCustomers.find(c => c.id === this.customerId);
    const task: Task = {
      name: this.name,
      description: this.description,
      status: this.status,
      type: this.taskType,
      priority: this.priority,
      enteredOn: (this.task && this.task.enteredOn) || new firestore.Timestamp(this.getSeconds(), 0),
      customerId: this.customerId,
      customerName: customer && customer.name
    };

    if (this.beginDate) {
      task.beginDate = this.beginDate;
    }

    if (this.endDate) {
      task.endDate = this.endDate;
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
