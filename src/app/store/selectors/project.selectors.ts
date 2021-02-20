import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectors, ProjectState } from '@app/store/reducers/project/project.reducer';

export const selectProjects = createFeatureSelector('projects');
export const selectProjectEntities = createSelector(selectProjects, selectors.selectEntities);
export const selectAllProjects = createSelector(selectProjects, selectors.selectAll);
export const selectAllActiveProjects = createSelector(selectAllProjects, (timers) =>
  timers.filter((p) => !!p.isActive)
);
export const selectProject = createSelector(selectAllProjects, (timers, props) =>
  timers.find((p) => p.id === props.id)
);
export const selectProjectCount = createSelector(selectProjects, selectors.selectTotal);
export const selectProjectIds = createSelector(selectProjects, selectors.selectIds);
export const selectProjectLoading = createSelector(selectProjects, (state: ProjectState) => state.loading);
export const selectProjectError = createSelector(selectProjects, (state: ProjectState) => state.error);
