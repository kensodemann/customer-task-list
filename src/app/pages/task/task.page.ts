import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { logout } from '@app/store/actions/auth.actions';
import { State } from '@app/store';
import { TasksService } from '@app/services/firestore-data';
import { Task } from '@app/models';
import { TaskEditorComponent } from '@app/editors';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  task: Task;

  constructor(
    private modal: ModalController,
    private route: ActivatedRoute,
    private store: Store<State>,
    private tasks: TasksService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('taskId');
    this.task = await this.tasks.get(id);
  }

  async edit() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: TaskEditorComponent,
      componentProps: { task: this.task },
    });
    m.present();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
