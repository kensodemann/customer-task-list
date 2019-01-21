import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { ApplicationService } from './services/application/application.service';

import { AppComponent } from './app.component';
import { createApplicationServiceMock } from './services/application/application.mock';
import { createAngularFireAuthMock, createNavControllerMock } from 'test/mocks';

describe('AppComponent', () => {
  let angularFireAuth;
  let application;
  let navController;

  beforeEach(async(() => {
    angularFireAuth = createAngularFireAuthMock();
    navController = createNavControllerMock();
    application = createApplicationServiceMock();
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuth },
        { provide: NavController, useValue: navController },
        { provide: ApplicationService, useValue: application }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('registers for updates', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
  });

  describe('changing the user', () => {
    beforeEach(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });

    it('does not navigate if there is a user', () => {
      angularFireAuth.authState.next({ id: 42 });
      expect(navController.navigateRoot).not.toHaveBeenCalled();
    });

    it('navigates to login if there is no user', () => {
      angularFireAuth.authState.next();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
    });
  });
});
