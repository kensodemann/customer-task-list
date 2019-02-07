import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { ApplicationService } from './services/application/application.service';

import { AppComponent } from './app.component';
import { createApplicationServiceMock } from './services/application/application.mock';
import { createAngularFireAuthMock, createNavControllerMock } from 'test/mocks';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: NavController, useFactory: createNavControllerMock },
        {
          provide: ApplicationService,
          useFactory: createApplicationServiceMock
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('registers for updates', () => {
    const application = TestBed.get(ApplicationService);
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
      const angularFireAuth = TestBed.get(AngularFireAuth);
      const navController = TestBed.get(NavController);
      angularFireAuth.authState.next({ id: 42 });
      expect(navController.navigateRoot).not.toHaveBeenCalled();
    });

    it('navigates to login if there is no user', () => {
      const angularFireAuth = TestBed.get(AngularFireAuth);
      const navController = TestBed.get(NavController);
      angularFireAuth.authState.next();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
    });
  });
});
