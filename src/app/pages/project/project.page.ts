import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '@app/store/actions/auth.actions';
import { ProjectEditorComponent } from '@app/editors';
import { ProjectsService, TasksService } from '@app/services/firestore-data';
import { Project, Task } from '@app/models';
import { statuses } from '@app/default-data';
import { State } from '@app/store';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss']
})
export class ProjectPage implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];
  private projectTasks: Array<Task>;

  project: Project;
  statuses: Array<string>;

  constructor(
    private projects: ProjectsService,
    private modal: ModalController,
    public navController: NavController,
    private route: ActivatedRoute,
    private store: Store<State>,
    private tasks: TasksService
  ) {}

  async ngOnInit() {
    this.statuses = [...statuses];
    const id = this.route.snapshot.paramMap.get('projectId');
    this.subscriptions.push(this.tasks.forProject(id).subscribe(t => (this.projectTasks = t)));
    this.project = await this.projects.get(id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async edit() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: ProjectEditorComponent,
      componentProps: { project: this.project }
    });
    return await m.present();
  }

  taskCount(status?: string): number {
    return this.projectTasks ? this.projectTasks.filter(t => !status || t.status === status).length : 0;
  }

  logout() {
    this.store.dispatch(logout());
  }
}
