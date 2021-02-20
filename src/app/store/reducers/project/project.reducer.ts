import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as ProjectActions from '@app/store/actions/project.actions';
import { Project } from '@app/models';

export interface ProjectState extends EntityState<Project> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Project>();

export const initialState = adapter.getInitialState({ loading: false });

export const reducer = createReducer<ProjectState>(
  initialState,
  on(ProjectActions.load, (state) => adapter.removeAll({ ...state, loading: true, error: undefined })),
  on(ProjectActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ProjectActions.create, (state) => ({ ...state, loading: true, error: undefined })),
  on(ProjectActions.createFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ProjectActions.update, (state) => ({ ...state, loading: true, error: undefined })),
  on(ProjectActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ProjectActions.projectAdded, (state, { project }) => adapter.addOne(project, { ...state, loading: false })),
  on(ProjectActions.projectsAdded, (state, { projects }) => adapter.addMany(projects, { ...state, loading: false })),
  on(ProjectActions.projectModified, (state, { project }) =>
    adapter.updateOne({ id: project.id, changes: project }, { ...state, loading: false })
  ),
  on(ProjectActions.projectRemoved, (state, { project }) => adapter.removeOne(project.id, { ...state, loading: false }))
);

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
};
