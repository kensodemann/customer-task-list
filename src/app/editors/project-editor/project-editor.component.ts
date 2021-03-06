import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Project } from '@app/models';
import { State, selectAllProjects } from '@app/store';
import { takeUntil } from 'rxjs/operators';
import { update, create } from '@app/store/actions/project.actions';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnDestroy, OnInit {
  name: string;
  description: string;
  isActive: boolean;
  errorMessage: string;
  warningMessage: string;
  title: string;

  project: Project;

  private allProjects: Array<Project>;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private modal: ModalController, private store: Store<State>) {}

  ngOnInit() {
    this.getProjects();
    this.setTitle();
    this.initializeProperties();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  checkName() {
    const name = this.name && this.name.toLowerCase().trim();
    const id = this.project && this.project.id;
    const dup =
      this.allProjects &&
      this.allProjects.find(
        x => x.id !== id && x.name.toLowerCase().trim() === name,
      );
    this.warningMessage = dup ? 'a project with this name already exists' : '';
  }

  save() {
    if (this.project) {
      this.store.dispatch(update({ project: this.projectObject() }));
    } else {
      this.store.dispatch(create({ project: this.projectObject() }));
    }
    this.modal.dismiss();
  }

  private projectObject(): Project {
    const cus: Project = {
      name: this.name,
      description: this.description,
      isActive: this.isActive,
    };

    if (this.project) {
      cus.id = this.project.id;
    }

    return cus;
  }

  private getProjects() {
    this.store
      .pipe(select(selectAllProjects), takeUntil(this.destroy$))
      .subscribe(c => (this.allProjects = c));
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
