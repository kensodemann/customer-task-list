import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '@app/store/reducers/auth/auth.reducer';

export const selectAuth = createFeatureSelector('auth');
export const selectAuthEmail = createSelector(selectAuth, (state: AuthState) => state.email);
export const selectAuthLoading = createSelector(selectAuth, (state: AuthState) => state.loading);
export const selectAuthError = createSelector(selectAuth, (state: AuthState) => state.error);
export const selectAuthMessage = createSelector(selectAuth, (state: AuthState) => state.message);
