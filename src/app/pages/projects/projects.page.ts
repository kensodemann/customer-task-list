import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProjectEditorComponent } from '@app/editors';
import { ProjectsService } from '@app/services/firestore-data';
import { Project } from '@app/models';
import { byName } from '@app/util';

@Component({
  selector: 'app-projects',
  templateUrl: 'projects.page.html',
  styleUrls: ['projects.page.scss']
})
export class ProjectsPage implements OnDestroy, OnInit {
  private projectsSubscription: Subscription;

  allProjects: Array<Project>;

  constructor(
    private projects: ProjectsService,
    private modal: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.projectsSubscription = this.projects.all().subscribe(c => (this.allProjects = c.sort(byName)));
  }

  ngOnDestroy() {
    this.projectsSubscription.unsubscribe();
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
}
