import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss']
})
export class TaskPage implements OnInit {
  task: TaskWithId;

  constructor(
    private route: ActivatedRoute,
    private modal: ModalController,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.tasks.get(id).subscribe(t => (this.task = t));
  }

  async edit() {
    const m = await this.modal.create({
      component: TaskEditorComponent,
      componentProps: { task: this.task }
    });
    m.present();
  }
}
