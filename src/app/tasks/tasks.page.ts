import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
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

  allTasks: Array<TaskWithId>;

  private taskSubscription: Subscription;

  constructor(
    private alert: AlertController,
    public authentication: AuthenticationService,
    private modal: ModalController,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.taskSubscription = this.tasks.all().subscribe(t => {
      if (this.list) {
        this.list.closeSlidingItems();
      }
      this.allTasks = t;
    });
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  get openTasks(): Array<TaskWithId> {
    return this.tasksWithStatus('Open');
  }

  get repeatingTasks(): Array<TaskWithId> {
    return this.tasksWithStatus('Repeating');
  }

  get closedTasks(): Array<TaskWithId> {
    return this.tasksWithStatus('Closed');
  }

  get onHoldTasks(): Array<TaskWithId> {
    return this.tasksWithStatus('On Hold');
  }

  private tasksWithStatus(status: string): Array<TaskWithId> {
    return (
      (this.allTasks && this.allTasks.filter(t => t.status === status)) || []
    );
  }

  async add(): Promise<void> {
    const m = await this.modal.create({ component: TaskEditorComponent });
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
}
