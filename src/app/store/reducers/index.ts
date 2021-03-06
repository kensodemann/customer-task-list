import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import { AuthState, reducer as authReducer } from './auth/auth.reducer';
import {
  ProjectState,
  reducer as projectReducer,
} from './project/project.reducer';

export interface State {
  auth: AuthState;
  projects: ProjectState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  projects: projectReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
