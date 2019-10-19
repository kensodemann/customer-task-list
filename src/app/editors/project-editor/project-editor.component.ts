import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProjectsService } from '@app/services/firestore-data';
import { Project } from '@app/models';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnDestroy, OnInit {
  name: string;
  description: string;
  isActive: boolean;
  errorMessage: string;
  warningMessage: string;
  title: string;

  allProjects: Array<Project>;
  projectsSubscription: Subscription;
  project: Project;

  constructor(private projects: ProjectsService, private modal: ModalController) {}

  ngOnInit() {
    this.getProjects();
    this.setTitle();
    this.initializeProperties();
  }

  ngOnDestroy() {
    this.projectsSubscription.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  checkName() {
    const name = this.name && this.name.toLowerCase().trim();
    const id = this.project && this.project.id;
    const dup = this.allProjects && this.allProjects.find(x => x.id !== id && x.name.toLowerCase().trim() === name);
    this.warningMessage = dup ? 'a project with this name already exists' : '';
  }

  save() {
    try {
      if (this.project) {
        this.projects.update(this.projectObject());
      } else {
        this.projects.add(this.projectObject());
      }
      this.modal.dismiss();
    } catch (err) {
      this.errorMessage = err.message || 'Unknown error saving project';
    }
  }

  private projectObject(): Project {
    const cus: Project = {
      name: this.name,
      description: this.description,
      isActive: this.isActive
    };

    if (this.project) {
      cus.id = this.project.id;
    }

    return cus;
  }

  private getProjects() {
    this.projectsSubscription = this.projects.all().subscribe(c => (this.allProjects = c));
  }

  private initializeProperties() {
    if (this.project) {
      this.name = this.project.name;
      this.description = this.project.description;
      this.isActive = this.project.isActive;
    } else {
      this.isActive = true;
    }
  }

  private setTitle() {
    this.title = this.project ? 'Modify Project' : 'Add New Project';
  }
}
