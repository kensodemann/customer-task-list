import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
  allTasks: Array<TaskWithId>;

  private taskSubscription: Subscription;

  constructor(
    private alert: AlertController,
    public authentication: AuthenticationService,
    private modal: ModalController,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.taskSubscription = this.tasks
      .all()
      .subscribe(t => (this.allTasks = t));
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  async addTask(): Promise<void> {
    const m = await this.modal.create({ component: TaskEditorComponent });
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
