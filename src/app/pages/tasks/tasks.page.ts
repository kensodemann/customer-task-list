import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Statuses, Priorities } from '@app/default-data';
import { TaskEditorComponent } from '@app/editors';
import { TasksService } from '@app/services/firestore-data';
import { Task } from '@app/models';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss']
})
export class TasksPage implements OnDestroy, OnInit {
  @ViewChild(IonList, { static: true }) list: IonList;

  private projectId;
  private status;
  private taskSubscription: Subscription;

  openTasks: Array<Task>;
  closedTasks: Array<Task>;
  onHoldTasks: Array<Task>;
  showBackButton: boolean;

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    private navController: NavController,
    private route: ActivatedRoute,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.showBackButton = !!this.projectId;
    this.status = this.route.snapshot.paramMap.get('status');
    if (this.projectId) {
      this.taskSubscription = this.tasks.forProject(this.projectId).subscribe(t => this.unpackTasks(t));
    } else {
      this.taskSubscription = this.tasks.all().subscribe(t => this.unpackTasks(t));
    }
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  async add(): Promise<void> {
    const m = this.projectId
      ? await this.modal.create({
          backdropDismiss: false,
          component: TaskEditorComponent,
          componentProps: { projectId: this.projectId }
        })
      : await this.modal.create({
          backdropDismiss: false,
          component: TaskEditorComponent
        });
    return m.present();
  }

  close(task: Task) {
    const closedTask = { ...task, status: Statuses.Closed };
    this.tasks.update(closedTask);
  }

  async delete(task: Task): Promise<void> {
    const a = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to permanently remove this task?',
      buttons: [{ text: 'Yes', handler: () => this.tasks.delete(task) }, { text: 'No', role: 'cancel' }]
    });
    return a.present();
  }

  view(task: Task) {
    this.navController.navigateForward(['task', task.id]);
  }

  private unpackTasks(t: Array<Task>) {
    if (this.list) {
      this.list.closeSlidingItems();
    }
    this.openTasks = this.tasksWithStatus(t, Statuses.Open).sort((t1, t2) => this.taskSort(t1, t2));
    this.onHoldTasks = this.tasksWithStatus(t, Statuses.OnHold).sort((t1, t2) => this.taskSort(t1, t2));
    this.closedTasks = this.tasksWithStatus(t, Statuses.Closed);
  }

  private tasksWithStatus(allTasks: Array<Task>, status: string): Array<Task> {
    if (this.status && status !== this.status) {
      return [];
    }

    return (allTasks && allTasks.filter(t => t.status === status)) || [];
  }

  private taskSort(t1: Task, t2: Task) {
    if (this.priorityRank(t1) < this.priorityRank(t2)) {
      return -1;
    }
    if (this.priorityRank(t1) > this.priorityRank(t2)) {
      return 1;
    }
    if ((t1.beginDate || 'zzzz') < (t2.beginDate || 'zzzz')) {
      return -1;
    }
    if ((t1.beginDate || 'zzzz') > (t2.beginDate || 'zzzz')) {
      return 1;
    }
    if (t1.enteredOn.seconds < t2.enteredOn.seconds) {
      return -1;
    }
    if (t1.enteredOn.seconds > t2.enteredOn.seconds) {
      return 1;
    }
    return 0;
  }

  private priorityRank(task: Task): number {
    switch (task.priority) {
      case Priorities.High:
        return 0;
      case Priorities.Normal:
        return 1;
      case Priorities.Low:
        return 2;
      default:
        return 3;
    }
  }
}
