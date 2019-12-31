import { createAction, props } from '@ngrx/store';

export enum AuthActionTypes {
  LoginChanged = '[Application] login changed',

  Login = '[LoginPage] login',
  LoginSuccess = '[Auth API] login success',
  LoginFailure = '[Auth API] login failure',

  ResetPassword = '[LoginPage] reset password',
  ResetPasswordSuccess = '[Auth API] reset password success',
  ResetPasswordFailure = '[Auth API] reset password failure',

  Logout = '[Application] logout',
  LogoutSuccess = '[Auth API] logout success',
  LogoutFailure = '[Auth API] logout failure'
}

export const loginChanged = createAction(AuthActionTypes.LoginChanged, props<{ email: string }>());

export const login = createAction(AuthActionTypes.Login, props<{ email: string; password: string }>());
export const loginSuccess = createAction(AuthActionTypes.LoginSuccess);
export const loginFailure = createAction(AuthActionTypes.LoginFailure, props<{ error: Error }>());

export const logout = createAction(AuthActionTypes.Logout);
export const logoutSuccess = createAction(AuthActionTypes.LogoutSuccess);
export const logoutFailure = createAction(AuthActionTypes.LogoutFailure, props<{ error: Error }>());

export const resetPassword = createAction(AuthActionTypes.ResetPassword, props<{ email: string }>());
export const resetPasswordSuccess = createAction(AuthActionTypes.ResetPasswordSuccess, props<{ email: string }>());
export const resetPasswordFailure = createAction(AuthActionTypes.ResetPasswordFailure, props<{ error: Error }>());
