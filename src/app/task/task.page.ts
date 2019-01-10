import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss']
})
export class TaskPage implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];
  task: TaskWithId;

  constructor(
    private modal: ModalController,
    private route: ActivatedRoute,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.tasks.get(id).subscribe(t => (this.task = t)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async edit() {
    const m = await this.modal.create({
      component: TaskEditorComponent,
      componentProps: { task: this.task }
    });
    m.present();
  }
}
