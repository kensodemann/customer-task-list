import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthenticationService } from './authentication.service';
import { createAngularFireAuthMock } from 'test/mocks';

describe('AuthenticationService', () => {
  let angularFireAuth;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    angularFireAuth = createAngularFireAuthMock();
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFireAuth, useValue: angularFireAuth }]
    });
  });

  beforeEach(inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      authenticationService = service;
    }
  ));

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  describe('login', () => {
    it('calls the signin with email and password', () => {
      authenticationService.login('test@test.com', 'testpassword');
      expect(
        angularFireAuth.auth.signInWithEmailAndPassword
      ).toHaveBeenCalledTimes(1);
    });

    it('passes the email and password', () => {
      authenticationService.login('test@test.com', 'testpassword');
      expect(angularFireAuth.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@test.com',
        'testpassword'
      );
    });
  });

  describe('logout', () => {
    it('calls the signOut', () => {
      authenticationService.logout();
      expect(angularFireAuth.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPasswordResetEmail', () => {
    it('calls the firebase setPaswordResetEmail', () => {
      authenticationService.sendPasswordResetEmail('test@testme.org');
      expect(angularFireAuth.auth.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });

    it('passes the email', () => {
      authenticationService.sendPasswordResetEmail('test@testme.org');
      expect(angularFireAuth.auth.sendPasswordResetEmail).toHaveBeenCalledWith('test@testme.org');
    });
  });
});
