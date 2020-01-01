import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { TasksService } from '@app/services/firestore-data';
import { Task } from '@app/models';
import { TaskEditorComponent } from '@app/editors';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss']
})
export class TaskPage implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];
  task: Task;

  constructor(private modal: ModalController, private route: ActivatedRoute, private tasks: TasksService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('taskId');
    this.subscriptions.push(this.tasks.get(id).subscribe(t => (this.task = t)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async edit() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: TaskEditorComponent,
      componentProps: { task: this.task }
    });
    m.present();
  }
}
