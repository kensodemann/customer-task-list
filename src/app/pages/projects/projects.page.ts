import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { byName } from '@app/util';
import { logout } from '@app/store/actions/auth.actions';
import { ProjectEditorComponent } from '@app/editors';
import { Project } from '@app/models';
import { State, selectAllProjects } from '@app/store';

@Component({
  selector: 'app-projects',
  templateUrl: 'projects.page.html',
  styleUrls: ['projects.page.scss']
})
export class ProjectsPage implements OnInit {
  allProjects: Array<Project>;
  projects$: Observable<Array<Project>>;

  constructor(private modal: ModalController, private navController: NavController, private store: Store<State>) {}

  ngOnInit() {
    this.projects$ = this.store.pipe(
      select(selectAllProjects),
      map(p => p.sort(byName))
    );
  }

  async add() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: ProjectEditorComponent
    });
    m.present();
  }

  view(c: Project) {
    this.navController.navigateForward(['tabs', 'projects', c.id]);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
