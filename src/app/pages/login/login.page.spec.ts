import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  selectAuthEmail,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  State,
} from '@app/store';
import { login, resetPassword } from '@app/store/actions/auth.actions';
import { AuthState } from '@app/store/reducers/auth/auth.reducer';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let alert: any;
  let loading: any;
  let page: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(
    waitForAsync(() => {
      alert = createOverlayElementMock();
      loading = createOverlayElementMock();
      TestBed.configureTestingModule({
        imports: [FormsModule, IonicModule],
        declarations: [LoginPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: AlertController,
            useFactory: () => createOverlayControllerMock(alert),
          },
          {
            provide: LoadingController,
            useFactory: () => createOverlayControllerMock(loading),
          },
          { provide: NavController, useFactory: createNavControllerMock },
          provideMockStore<{ auth: AuthState }>({
            initialState: { auth: { email: '', loading: false } },
          }),
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  describe('login', () => {
    beforeEach(() => {
      page.email = 'test@mctesty.com';
      page.password = 'something secret';
    });

    it('dispatches the login action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      page.login();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        login({ email: 'test@mctesty.com', password: 'something secret' }),
      );
    });
  });

  describe('on loading changed', () => {
    let store: MockStore<State>;
    let mockAuthLoadingSelector: any;
    beforeEach(() => {
      store = TestBed.inject(Store) as MockStore<State>;
      mockAuthLoadingSelector = store.overrideSelector(
        selectAuthLoading,
        false,
      );
      fixture.detectChanges();
      loading.dismiss.mockClear();
    });

    it('presents and dismisses the loading indicator', () => {
      mockAuthLoadingSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();
      expect(loading.present).toHaveBeenCalledTimes(1);
      expect(loading.dismiss).not.toHaveBeenCalled();
      loading.present.mockClear();
      mockAuthLoadingSelector.setResult(false);
      store.refreshState();
      fixture.detectChanges();
      expect(loading.present).not.toHaveBeenCalled();
      expect(loading.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('on email changed', () => {
    let store: MockStore<State>;
    let mockAuthEmailSelector: any;
    beforeEach(() => {
      store = TestBed.inject(Store) as MockStore<State>;
      mockAuthEmailSelector = store.overrideSelector(
        selectAuthEmail,
        undefined,
      );
      fixture.detectChanges();
    });

    it('navigates to the app when the email is set', () => {
      const navController = TestBed.inject(NavController);
      mockAuthEmailSelector.setResult(null);
      store.refreshState();
      fixture.detectChanges();
      expect(navController.navigateRoot).not.toHaveBeenCalled();
      mockAuthEmailSelector.setResult('test@mctesterson.org');
      store.refreshState();
      fixture.detectChanges();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith('');
    });
  });

  describe('on error changed', () => {
    let store: MockStore<State>;
    let mockAuthErrorSelector: any;
    beforeEach(() => {
      store = TestBed.inject(Store) as MockStore<State>;
      mockAuthErrorSelector = store.overrideSelector(
        selectAuthError,
        undefined,
      );
      fixture.detectChanges();
    });

    it('sets and clears the error message', () => {
      mockAuthErrorSelector.setResult(new Error('This is an error logging in'));
      store.refreshState();
      fixture.detectChanges();
      expect(page.errorMessage).toEqual('This is an error logging in');
      mockAuthErrorSelector.setResult(undefined);
      store.refreshState();
      fixture.detectChanges();
      expect(page.errorMessage).toEqual(undefined);
    });

    it('clears the password on error', () => {
      page.password = 'my dark secrets';
      mockAuthErrorSelector.setResult(new Error('This is an error logging in'));
      store.refreshState();
      fixture.detectChanges();
      expect(page.password).toEqual('');
      page.password = 'my dark secrets';
      mockAuthErrorSelector.setResult(undefined);
      store.refreshState();
      fixture.detectChanges();
      expect(page.password).toEqual('my dark secrets');
    });
  });

  describe('on message changed', () => {
    let store: MockStore<State>;
    let mockAuthMessageSelector: any;
    beforeEach(() => {
      store = TestBed.inject(Store) as MockStore<State>;
      mockAuthMessageSelector = store.overrideSelector(
        selectAuthMessage,
        undefined,
      );
      fixture.detectChanges();
    });

    it('sets the info message', () => {
      mockAuthMessageSelector.setResult('It worked!!');
      store.refreshState();
      fixture.detectChanges();
      expect(page.infoMessage).toEqual('It worked!!');
      mockAuthMessageSelector.setResult(undefined);
      store.refreshState();
      fixture.detectChanges();
      expect(page.infoMessage).toEqual(undefined);
    });
  });

  describe('password reset', () => {
    it('creates an alert', () => {
      const alertController = TestBed.inject(AlertController);
      page.handlePasswordReset();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    describe('the alert', () => {
      let params: any;
      beforeEach(async () => {
        const alertController = TestBed.inject(AlertController);
        await page.handlePasswordReset();
        params = (alertController.create as any).mock.calls[0][0];
      });

      it('asks for the user e-mail', () => {
        expect(params.header).toEqual('Password Reset');
        expect(params.subHeader).toEqual('Enter your e-mail address');
      });

      it('describes the process', () => {
        expect(params.message).toContain(
          'link that will allow you to reset your password',
        );
      });

      it('has an input for the e-mail address', () => {
        expect(params.inputs.length).toEqual(1);
        expect(params.inputs[0]).toEqual({
          name: 'emailAddress',
          type: 'email',
          placeholder: 'your.email@address.com',
        });
      });

      it('provides "Cancel" and "Send" buttons', () => {
        expect(params.buttons[0]).toEqual({ text: 'Cancel', role: 'cancel' });
        expect(params.buttons[1]).toEqual({
          text: 'Send e-mail',
          role: 'send',
        });
      });

      it('is presented', () => {
        expect(alert.present).toHaveBeenCalledTimes(1);
      });
    });

    describe('on alert dismiss', () => {
      let store: MockStore<State>;
      beforeEach(() => {
        store = TestBed.inject(Store) as MockStore<State>;
        store.dispatch = jest.fn();
      });

      it('dispatches the reset action if and e-mail is entered and send is pressed', async () => {
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'send',
        });
        await page.handlePasswordReset();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          resetPassword({ email: 'test@testy.com' }),
        );
      });

      it('does not dispatch the reset action if no email address is entered', async () => {
        alert.onDidDismiss.mockResolvedValue({
          data: { values: {} },
          role: 'send',
        });
        await page.handlePasswordReset();
        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('does not dispatch the reset action if cancel is pressed', async () => {
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'cancel',
        });
        await page.handlePasswordReset();
        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('does not dispatch the reset action if background is pressed', async () => {
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'background',
        });
        await page.handlePasswordReset();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });
});
