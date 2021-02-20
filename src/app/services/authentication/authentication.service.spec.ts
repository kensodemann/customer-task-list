import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { createAngularFireAuthMock } from '@test/mocks';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFireAuth, useFactory: createAngularFireAuthMock }],
    });
  });

  beforeEach(inject([AuthenticationService], (service: AuthenticationService) => {
    authenticationService = service;
  }));

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  describe('login', () => {
    it('calls the signin with email and password', () => {
      const angularFireAuth = TestBed.inject(AngularFireAuth);
      authenticationService.login('test@test.com', 'testpassword');
      expect(angularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });

    it('passes the email and password', () => {
      const angularFireAuth = TestBed.inject(AngularFireAuth);
      authenticationService.login('test@test.com', 'testpassword');
      expect(angularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'testpassword');
    });
  });

  describe('logout', () => {
    it('calls the signOut', () => {
      const angularFireAuth = TestBed.inject(AngularFireAuth);
      authenticationService.logout();
      expect(angularFireAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPasswordResetEmail', () => {
    it('calls the firebase setPaswordResetEmail', () => {
      const angularFireAuth = TestBed.inject(AngularFireAuth);
      authenticationService.sendPasswordResetEmail('test@testme.org');
      expect(angularFireAuth.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });

    it('passes the email', () => {
      const angularFireAuth = TestBed.inject(AngularFireAuth);
      authenticationService.sendPasswordResetEmail('test@testme.org');
      expect(angularFireAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@testme.org');
    });
  });
});
