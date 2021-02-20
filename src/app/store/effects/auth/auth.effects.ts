import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
} from '@app/store/actions/auth.actions';
import { AuthenticationService } from '@app/services';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authenticationService: AuthenticationService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        from(this.authenticationService.login(action.email, action.password)).pipe(
          map(() => loginSuccess()),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        from(this.authenticationService.logout()).pipe(
          map(() => logoutSuccess()),
          catchError((error) => of(logoutFailure({ error })))
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      exhaustMap((action) =>
        from(this.authenticationService.sendPasswordResetEmail(action.email)).pipe(
          map(() => resetPasswordSuccess({ email: action.email })),
          catchError((error) => of(resetPasswordFailure({ error })))
        )
      )
    )
  );
}
