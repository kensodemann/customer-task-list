import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { createAngularFireAuthMock, createNavControllerMock } from 'test/mocks';
import { of } from 'rxjs';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let authGuard: AuthGuardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: NavController, useFactory: createNavControllerMock }
      ]
    });
  });

  beforeEach(inject([AuthGuardService], (service: AuthGuardService) => {
    authGuard = service;
  }));

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  describe('canActivate', () => {
    describe('with a current user', () => {
      beforeEach(() => {
        const af = TestBed.get(AngularFireAuth);
        af.user = of({ email: 'test@test.com' });
      });

      it('allows navigation', async () => {
        expect(await authGuard.canActivate()).toEqual(true);
      });
    });

    describe('without a current user', () => {
      beforeEach(() => {
        const af = TestBed.get(AngularFireAuth);
        af.user = of(null);
      });

      it('does not allow navigation', async () => {
        expect(await authGuard.canActivate()).toEqual(false);
      });

      it('navigates to the login page', async () => {
        const nav = TestBed.get(NavController);
        await authGuard.canActivate();
        expect(nav.navigateRoot).toHaveBeenCalledTimes(1);
        expect(nav.navigateRoot).toHaveBeenCalledWith(['login']);
      });
    });
  });
});
