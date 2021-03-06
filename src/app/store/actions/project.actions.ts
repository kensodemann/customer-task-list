import { createAction, props } from '@ngrx/store';
import { Project } from '@app/models';

export const create = createAction(
  '[Project Editor] add project',
  props<{ project: Project }>(),
);
export const createSuccess = createAction('[Projects API] create success');
export const createFailure = createAction(
  '[Projects API] create failure',
  props<{ error: Error }>(),
);

export const update = createAction(
  '[Project Editor] update project',
  props<{ project: Project }>(),
);
export const updateSuccess = createAction('[Projects API] update success');
export const updateFailure = createAction(
  '[Projects API] update failure',
  props<{ error: Error }>(),
);

export const load = createAction('[Application] load projects');
export const loadSuccess = createAction('[Projects API] load success');
export const loadFailure = createAction(
  '[Projects API] load failure',
  props<{ error: Error }>(),
);

export const projectAdded = createAction(
  '[Project Load State Change] added',
  props<{ project: Project }>(),
);
export const projectsAdded = createAction(
  '[Project Load State Change] added many',
  props<{ projects: Array<Project> }>(),
);
export const projectModified = createAction(
  '[Project Load State Change] modified',
  props<{ project: Project }>(),
);
export const projectRemoved = createAction(
  '[Project Load State Change] removed',
  props<{ project: Project }>(),
);
