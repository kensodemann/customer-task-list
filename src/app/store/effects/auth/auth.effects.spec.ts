import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { AuthEffects } from './auth.effects';
import { AuthenticationService } from '@app/services';
import { createAuthenticationServiceMock } from '@app/services/mocks';
import { AuthActionTypes, login, logout, resetPassword, resetPasswordSuccess } from '@app/store/actions/auth.actions';

let actions$: Observable<any>;
let effects: AuthEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      AuthEffects,
      { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
      provideMockActions(() => actions$)
    ]
  });

  effects = TestBed.get<AuthEffects>(AuthEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('login$', () => {
  it('calls the login', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).toHaveBeenCalledTimes(1);
  });

  it('passes the email and password', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).toHaveBeenCalledWith('test@testty.com', 'mysecret');
  });

  it('dispatches login success', done => {
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(action => {
      expect(action).toEqual({ type: AuthActionTypes.LoginSuccess });
      done();
    });
  });

  it('dispatches login errors', done => {
    const authenticationService = TestBed.get(AuthenticationService);
    authenticationService.login.mockRejectedValue(new Error('The login failed'));
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(action => {
      expect(action).toEqual({ type: AuthActionTypes.LoginFailure, error: new Error('The login failed') });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(logout());
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).not.toHaveBeenCalled();
  });
});

describe('logout$', () => {
  it('calls the logout', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(logout());
    effects.logout$.subscribe(() => {});
    expect(authenticationService.logout).toHaveBeenCalledTimes(1);
  });

  it('dispatches logout success', done => {
    actions$ = of(logout());
    effects.logout$.subscribe(action => {
      expect(action).toEqual({ type: AuthActionTypes.LogoutSuccess });
      done();
    });
  });

  it('dispatches login errors', done => {
    const authenticationService = TestBed.get(AuthenticationService);
    authenticationService.logout.mockRejectedValue(new Error('The logout failed'));
    actions$ = of(logout());
    effects.logout$.subscribe(action => {
      expect(action).toEqual({ type: AuthActionTypes.LogoutFailure, error: new Error('The logout failed') });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.logout$.subscribe(() => {});
    expect(authenticationService.logout).not.toHaveBeenCalled();
  });
});

describe('resetPassword$', () => {
  it('calls resetPassword', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
  });

  it('passes the email', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).toHaveBeenCalledWith('test@testty.com');
  });

  it('dispatches reset password success', done => {
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(action => {
      expect(action).toEqual(resetPasswordSuccess({ email: 'test@testty.com' }));
      done();
    });
  });

  it('dispatches errors', done => {
    const authenticationService = TestBed.get(AuthenticationService);
    authenticationService.sendPasswordResetEmail.mockRejectedValue(new Error('The reset failed'));
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(action => {
      expect(action).toEqual({ type: AuthActionTypes.ResetPasswordFailure, error: new Error('The reset failed') });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.get(AuthenticationService);
    actions$ = of(logout());
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
