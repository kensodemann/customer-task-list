import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createAngularFireAuthMock,
  createNavControllerMock,
} from '@test/mocks';
import { AppComponent } from './app.component';
import { createApplicationServiceMock } from './services/application/application.mock';
import { ApplicationService } from './services/application/application.service';
import { loginChanged } from './store/actions/auth.actions';
import { load as loadProjects } from './store/actions/project.actions';
import { State } from './store/reducers';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
          { provide: NavController, useFactory: createNavControllerMock },
          {
            provide: ApplicationService,
            useFactory: createApplicationServiceMock,
          },
          provideMockStore<State>(),
        ],
      }).compileComponents();
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('registers for updates', () => {
    const application = TestBed.inject(ApplicationService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
  });

  describe('changing the user', () => {
    let store: MockStore<State>;
    beforeEach(() => {
      store = TestBed.inject(Store) as MockStore<State>;
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      (store.dispatch as any).mockClear();
    });

    describe('on login', () => {
      it('does not navigate', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next({
          id: 42,
          email: 'test@testty.com',
        });
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });

      it('dispatches the user change and load', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next({
          id: 42,
          email: 'test@testty.com',
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(
          loginChanged({ email: 'test@testty.com' }),
        );
        expect(store.dispatch).toHaveBeenCalledWith(loadProjects());
      });
    });

    describe('on logout', () => {
      it('navigates to login', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next(null);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
      });

      it('dispatches the user change', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next(null);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          loginChanged({ email: null }),
        );
      });
    });
  });
});
