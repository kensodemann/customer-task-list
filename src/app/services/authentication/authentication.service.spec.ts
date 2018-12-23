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

  beforeEach(inject([AuthenticationService], (service: AuthenticationService) => {
    authenticationService = service;
  }));

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  describe('login', () => {
    it('calls the signin with popup', () => {
      authenticationService.login();
      expect(angularFireAuth.auth.signInWithPopup).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('calls the signOut', () => {
      authenticationService.logout();
      expect(angularFireAuth.auth.signOut).toHaveBeenCalledTimes(1);
    });
   });
});
