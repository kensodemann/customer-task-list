import { createAction, props } from '@ngrx/store';
import { Project } from '@app/models';

export enum ProjectActionTypes {
  create = '[Project Editor] add project',
  createSuccess = '[Projects API] create success',
  createFailure = '[Projects API] create failure',

  update = '[Project Editor] update project',
  updateSuccess = '[Projects API] update success',
  updateFailure = '[Projects API] update failure',

  load = '[Application] load projects',
  loadSuccess = '[Projects API] load success',
  loadFailure = '[Projects API] load failure',

  projectAdded = '[Project Load State Change] added',
  projectsAdded = '[Project Load State Change] added many',
  projectModified = '[Project Load State Change] modified',
  projectRemoved = '[Project Load State Change] removed'
}

export const create = createAction(ProjectActionTypes.create, props<{ project: Project }>());
export const createSuccess = createAction(ProjectActionTypes.createSuccess);
export const createFailure = createAction(ProjectActionTypes.createFailure, props<{ error: Error }>());

export const update = createAction(ProjectActionTypes.update, props<{ project: Project }>());
export const updateSuccess = createAction(ProjectActionTypes.updateSuccess);
export const updateFailure = createAction(ProjectActionTypes.updateFailure, props<{ error: Error }>());

export const load = createAction(ProjectActionTypes.load);
export const loadSuccess = createAction(ProjectActionTypes.loadSuccess);
export const loadFailure = createAction(ProjectActionTypes.loadFailure, props<{ error: Error }>());

export const projectAdded = createAction(ProjectActionTypes.projectAdded, props<{ project: Project }>());
export const projectsAdded = createAction(ProjectActionTypes.projectsAdded, props<{ projects: Array<Project> }>());
export const projectModified = createAction(ProjectActionTypes.projectModified, props<{ project: Project }>());
export const projectRemoved = createAction(ProjectActionTypes.projectRemoved, props<{ project: Project }>());
