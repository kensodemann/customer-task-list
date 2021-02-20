import { createAction, props } from '@ngrx/store';

export const loginChanged = createAction('[Application] login changed', props<{ email: string }>());

export const login = createAction('[LoginPage] login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth API] login success');
export const loginFailure = createAction('[Auth API] login failure', props<{ error: Error }>());

export const logout = createAction('[Application] logout');
export const logoutSuccess = createAction('[Auth API] logout success');
export const logoutFailure = createAction('[Auth API] logout failure', props<{ error: Error }>());

export const resetPassword = createAction('[LoginPage] reset password', props<{ email: string }>());
export const resetPasswordSuccess = createAction('[Auth API] reset password success', props<{ email: string }>());
export const resetPasswordFailure = createAction('[Auth API] reset password failure', props<{ error: Error }>());
