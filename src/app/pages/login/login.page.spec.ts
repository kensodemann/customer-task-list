import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController
} from '@ionic/angular';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../../services/authentication/authentication.mock';
import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let alert;
  let loading;
  let page: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    loading = createOverlayElementMock('Loading');
    TestBed.configureTestingModule({
      imports: [FormsModule, IonicModule],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AlertController,
          useFactory: () =>
            createOverlayControllerMock('AlertController', alert)
        },
        {
          provide: AuthenticationService,
          useFactory: createAuthenticationServiceMock
        },
        {
          provide: LoadingController,
          useFactory: () =>
            createOverlayControllerMock('LoadingController', loading)
        },
        { provide: NavController, useFactory: createNavControllerMock }
      ]
    }).compileComponents();
  }));

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

    it('creates a loading indicator', async () => {
      const lc = TestBed.get(LoadingController);
      await page.login();
      expect(lc.create).toHaveBeenCalledTimes(1);
      expect(loading.present).toHaveBeenCalledTimes(1);
    });

    it('calls the authentication login', async () => {
      const authentication = TestBed.get(AuthenticationService);
      await page.login();
      expect(authentication.login).toHaveBeenCalledTimes(1);
    });

    it('passes the email address and password to the login', async () => {
      const authentication = TestBed.get(AuthenticationService);
      await page.login();
      expect(authentication.login).toHaveBeenCalledWith(
        'test@mctesty.com',
        'something secret'
      );
    });

    describe('when no user is returned', () => {
      it('does not navigate', async () => {
        const navController = TestBed.get(NavController);
        await page.login();
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });

      it('dismisses the loading indicator', async () => {
        await page.login();
        expect(loading.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('when a user is returned', () => {
      beforeEach(() => {
        const authentication = TestBed.get(AuthenticationService);
        authentication.login.and.returnValue(Promise.resolve({ id: 42 }));
      });

      it('navigates to the main page', async () => {
        const navController = TestBed.get(NavController);
        await page.login();
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith('');
      });

      it('dismisses the loading indicator', async () => {
        await page.login();
        expect(loading.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the login fails', () => {
      beforeEach(() => {
        const authentication = TestBed.get(AuthenticationService);
        authentication.login.and.returnValue(
          Promise.reject({
            code: 'auth/wrong-password',
            message:
              'The password is invalid or the user does not have a password.'
          })
        );
      });

      it('displays an error message', async () => {
        await page.login();
        expect(page.errorMessage).toEqual(
          'The password is invalid or the user does not have a password.'
        );
      });

      it('clears the password', async () => {
        await page.login();
        expect(page.password).toBeFalsy();
      });

      it('dismisses the loading indicator', async () => {
        await page.login();
        expect(loading.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('password reset', () => {
    it('creates an alert', () => {
      const alertController = TestBed.get(AlertController);
      page.handlePasswordReset();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    describe('the alert', () => {
      let params;
      beforeEach(async () => {
        const alertController = TestBed.get(AlertController);
        await page.handlePasswordReset();
        params = alertController.create.calls.argsFor(0)[0];
      });

      it('asks for the user e-mail', () => {
        expect(params.header).toEqual('Password Reset');
        expect(params.subHeader).toEqual('Enter your e-mail address');
      });

      it('describes the process', () => {
        expect(params.message).toContain(
          'link that will allow you to reset your password'
        );
      });

      it('has an input for the e-mail address', () => {
        expect(params.inputs.length).toEqual(1);
        expect(params.inputs[0]).toEqual({
          name: 'emailAddress',
          type: 'email',
          placeholder: 'your.email@address.com'
        });
      });

      it('provides "Cancel" and "Send" buttons', () => {
        expect(params.buttons[0]).toEqual({ text: 'Cancel', role: 'cancel' });
        expect(params.buttons[1]).toEqual({
          text: 'Send e-mail',
          role: 'send'
        });
      });

      it('is presented', () => {
        expect(alert.present).toHaveBeenCalledTimes(1);
      });
    });

    describe('on alert dismiss', () => {
      it('sends the reset e-mail if entered and send is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: { values: { emailAddress: 'test@testy.com' } },
            role: 'send'
          })
        );
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
        expect(authentication.sendPasswordResetEmail).toHaveBeenCalledWith(
          'test@testy.com'
        );
      });

      it('does not send the reset e-mail if no email address is entered', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: { values: {} },
            role: 'send'
          })
        );
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      it('does not send the reset e-mail if cancel is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: { values: { emailAddress: 'test@testy.com' } },
            role: 'cancel'
          })
        );
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      it('does not send the reset e-mail if background is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: { values: { emailAddress: 'test@testy.com' } },
            role: 'background'
          })
        );
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });
    });
  });
});
