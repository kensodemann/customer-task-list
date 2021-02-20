import { Component, OnDestroy, OnInit } from '@angular/core';
import { Priorities, priorities, Statuses, statuses, TaskTypes, taskTypes } from '@app/default-data';
import { Task } from '@app/models';
import { TasksService } from '@app/services/firestore-data';
import { selectAllProjects, State } from '@app/store';
import { byName } from '@app/util';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { addDays, addYears, differenceInCalendarDays, format, parseISO } from 'date-fns';
import firebase from 'firebase/app';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss'],
})
export class TaskEditorComponent implements OnInit, OnDestroy {
  title: string;

  projectId: string;
  description: string;
  beginDate: string;
  endDate: string;
  maxDate: string;
  name: string;
  priority: string;
  schedule: boolean;
  status: string;
  taskType: string;

  task: Task;

  activeProjects: Array<{ id: string; name: string }>;
  priorities: Array<string>;
  statuses: Array<string>;
  taskTypes: Array<string>;

  errorMessage: string;
  warningMessage: string;

  projectSubscription: Subscription;

  private daysBetween;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private modal: ModalController, private store: Store<State>, private tasks: TasksService) {}

  ngOnInit() {
    this.priorities = [...priorities];
    this.statuses = [...statuses];
    this.taskTypes = [...taskTypes];
    this.maxDate = format(addYears(new Date(Date.now()), 3), 'yyyy-MM-dd');

    if (this.task) {
      this.title = 'Modify Task';
      this.copyTaskProperties();
    } else {
      this.title = 'Add New Task';
      this.defaultTaskProperties();
    }

    this.store.pipe(select(selectAllProjects), takeUntil(this.destroy$)).subscribe((projects) => {
      this.activeProjects = projects
        .filter((c) => c.isActive || (this.task && this.task.projectId === c.id))
        .map((c) => ({ id: c.id, name: c.name }))
        .sort(byName);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  save() {
    if (this.task) {
      this.tasks.update(this.taskObject());
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
    this.projectId = this.task.projectId;
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
    // The Date.now() is to ease the testing
    return format(new Date(Date.now()), 'yyyy-MM-dd');
  }

  private defaultTaskProperties() {
    this.priority = Priorities.normal;
    this.status = Statuses.open;
    this.taskType = TaskTypes.feature;
  }

  private taskObject(): Task {
    const project = this.activeProjects.find((c) => c.id === this.projectId);
    const task: Task = {
      name: this.name,
      description: this.description,
      status: this.status,
      type: this.taskType,
      priority: this.priority,
      enteredOn: (this.task && this.task.enteredOn) || new firebase.firestore.Timestamp(this.getSeconds(), 0),
      projectId: this.projectId,
      projectName: project && project.name,
    };

    if (this.beginDate) {
      task.beginDate = this.beginDate;
    }

    if (this.endDate) {
      task.endDate = this.endDate;
    }

    if (this.task) {
      task.id = this.task.id;
    }

    return task;
  }

  private getSeconds(): number {
    return Math.round(Date.now() / 1000);
  }
}
