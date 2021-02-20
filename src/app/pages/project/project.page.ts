import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';

import { logout } from '@app/store/actions/auth.actions';
import { ProjectEditorComponent } from '@app/editors';
import { TasksService } from '@app/services/firestore-data';
import { Project, Task } from '@app/models';
import { statuses } from '@app/default-data';
import { State, selectProject } from '@app/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnDestroy, OnInit {
  project: Project;
  statuses: Array<string>;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private projectTasks: Array<Task>;

  constructor(
    private modal: ModalController,
    public navController: NavController,
    private route: ActivatedRoute,
    private store: Store<State>,
    private tasks: TasksService
  ) {}

  async ngOnInit() {
    this.statuses = [...statuses];
    const id = this.route.snapshot.paramMap.get('projectId');
    this.tasks
      .forProject(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((t) => (this.projectTasks = t));
    this.store.pipe(select(selectProject, { id }), takeUntil(this.destroy$)).subscribe((p) => (this.project = p));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async edit() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: ProjectEditorComponent,
      componentProps: { project: this.project },
    });
    return await m.present();
  }

  taskCount(status?: string): number {
    return this.projectTasks ? this.projectTasks.filter((t) => !status || t.status === status).length : 0;
  }

  logout() {
    this.store.dispatch(logout());
  }
}
