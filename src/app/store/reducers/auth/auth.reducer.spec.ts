import { initialState, reducer } from './auth.reducer';
import {
  AuthActionTypes,
  loginChanged,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure
} from '@app/store/actions/auth.actions';

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(AuthActionTypes.LoginChanged, () => {
  it('sets the email in the state', () => {
    const action = loginChanged({ email: 'test@testy.com' });
    expect(reducer(undefined, action)).toEqual({ email: 'test@testy.com', loading: false });
  });

  it('clears the email in the state', () => {
    const action = loginChanged({ email: undefined });
    expect(reducer({ email: 'test@testy.com', loading: false }, action)).toEqual({
      email: undefined,
      loading: false
    });
  });
});

describe(AuthActionTypes.Login, () => {
  it('sets the loading flag and clears other data', () => {
    const action = login({ email: 'test@testy.com', password: 'mysecret' });
    expect(
      reducer(
        { email: '', loading: false, message: 'this is random information', error: new Error('Invalid Password') },
        action
      )
    ).toEqual({
      email: '',
      loading: true,
      message: undefined,
      error: undefined
    });
  });
});

describe(AuthActionTypes.LoginSuccess, () => {
  it('clears the loading flag', () => {
    const action = loginSuccess();
    expect(reducer({ email: '', loading: true, message: undefined, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: undefined
    });
  });
});

describe(AuthActionTypes.LoginFailure, () => {
  it('clears the loading flag and sets the error', () => {
    const action = loginFailure({ error: new Error('There was a failure, it was a mess') });
    expect(reducer({ email: '', loading: true, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: new Error('There was a failure, it was a mess')
    });
  });
});

describe(AuthActionTypes.Logout, () => {
  it('sets the loading flag and clears other data', () => {
    const action = logout();
    expect(
      reducer(
        {
          email: '',
          loading: false,
          message: 'this is useless information',
          error: new Error('How can you fail to logout?')
        },
        action
      )
    ).toEqual({
      email: '',
      loading: true,
      message: undefined,
      error: undefined
    });
  });
});

describe(AuthActionTypes.LogoutSuccess, () => {
  it('clears the loading flag', () => {
    const action = logoutSuccess();
    expect(reducer({ email: '', loading: true, message: undefined, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: undefined
    });
  });
});

describe(AuthActionTypes.LogoutFailure, () => {
  it('clears the loading flag and sets the error', () => {
    const action = logoutFailure({ error: new Error('There was a failure, it was a mess') });
    expect(reducer({ email: '', loading: true, message: undefined, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: new Error('There was a failure, it was a mess')
    });
  });
});

describe(AuthActionTypes.ResetPassword, () => {
  it('clears the error and message data', () => {
    const action = resetPassword({ email: 'test@testtea.com' });
    expect(
      reducer(
        {
          email: '',
          loading: false,
          message: 'this is useless information',
          error: new Error('How can you fail to logout?')
        },
        action
      )
    ).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: undefined
    });
  });
});

describe(AuthActionTypes.ResetPasswordSuccess, () => {
  it('sets the message string', () => {
    const action = resetPasswordSuccess({ email: 'test@testtea.com' });
    expect(reducer({ email: '', loading: false, message: undefined, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: 'An e-mail has been sent to test@testtea.com with password reset instructions.',
      error: undefined
    });
  });
});

describe(AuthActionTypes.ResetPasswordFailure, () => {
  it('sets the error', () => {
    const action = resetPasswordFailure({ error: new Error('There was a failure, it was a mess') });
    expect(reducer({ email: '', loading: false, message: undefined, error: undefined }, action)).toEqual({
      email: '',
      loading: false,
      message: undefined,
      error: new Error('There was a failure, it was a mess')
    });
  });
});
