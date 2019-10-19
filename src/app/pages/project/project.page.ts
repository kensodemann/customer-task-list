import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProjectEditorComponent } from '@app/editors';
import { ProjectsService, TasksService } from '@app/services/firestore-data';
import { Project, Task } from '@app/models';
import { statuses } from '@app/default-data';

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
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.statuses = [...statuses];
    const id = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.tasks.forProject(id).subscribe(t => (this.projectTasks = t)));
    this.subscriptions.push(this.projects.get(id).subscribe(c => (this.project = c)));
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
}
