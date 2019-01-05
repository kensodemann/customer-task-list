import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { Statuses } from '../default-data';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss']
})
export class TasksPage implements OnDestroy, OnInit {
  @ViewChild(IonList) list: IonList;

  private customerId;
  private status;
  private taskSubscription: Subscription;

  openTasks: Array<TaskWithId>;
  repeatingTasks: Array<TaskWithId>;
  closedTasks: Array<TaskWithId>;
  onHoldTasks: Array<TaskWithId>;

  constructor(
    private alert: AlertController,
    public authentication: AuthenticationService,
    private modal: ModalController,
    private route: ActivatedRoute,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.status = this.route.snapshot.paramMap.get('status');
    if (this.customerId) {
      this.taskSubscription = this.tasks
        .forCustomer(this.customerId)
        .subscribe(t => this.unpackTasks(t));
    } else {
      this.taskSubscription = this.tasks
        .all()
        .subscribe(t => this.unpackTasks(t));
    }
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  async add(): Promise<void> {
    const m = this.customerId
      ? await this.modal.create({
          component: TaskEditorComponent,
          componentProps: { customerId: this.customerId }
        })
      : await this.modal.create({ component: TaskEditorComponent });
    return m.present();
  }

  async edit(task: TaskWithId): Promise<void> {
    const m = await this.modal.create({
      component: TaskEditorComponent,
      componentProps: { task: task }
    });
    return m.present();
  }

  async delete(task: TaskWithId): Promise<void> {
    const a = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to perminantly remove this task?',
      buttons: [
        { text: 'Yes', handler: () => this.tasks.delete(task) },
        { text: 'No', role: 'cancel' }
      ]
    });
    return a.present();
  }

  private unpackTasks(t: Array<TaskWithId>) {
    if (this.list) {
      this.list.closeSlidingItems();
    }
    this.openTasks = this.tasksWithStatus(t, Statuses.Open);
    this.repeatingTasks = this.tasksWithStatus(t, Statuses.Repeating);
    this.onHoldTasks = this.tasksWithStatus(t, Statuses.OnHold);
    this.closedTasks = this.tasksWithStatus(t, Statuses.Closed);
  }

  private tasksWithStatus(
    allTasks: Array<TaskWithId>,
    status: string
  ): Array<TaskWithId> {
    if (this.status && status !== this.status) {
      return [];
    }

    return (allTasks && allTasks.filter(t => t.status === status)) || [];
  }
}
