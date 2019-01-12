import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { createNavControllerMock } from 'test/mocks';
import { LoginPage } from './login.page';

import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('LoginPage', () => {
  let alert;
  let alertController;
  let authentication;
  let page: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let navController;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    authentication = createAuthenticationServiceMock();
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      imports: [FormsModule, IonicModule],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useValue: alertController },
        { provide: AuthenticationService, useValue: authentication },
        { provide: NavController, useValue: navController }
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

    it('calls the authentication login', () => {
      page.login();
      expect(authentication.login).toHaveBeenCalledTimes(1);
    });

    it('passes the email address and password to the login', () => {
      page.login();
      expect(authentication.login).toHaveBeenCalledWith(
        'test@mctesty.com',
        'something secret'
      );
    });

    it('does not navigate if no user is returned', async () => {
      await page.login();
      expect(navController.navigateRoot).not.toHaveBeenCalled();
    });

    it('navigates to the main page if a user is returned', async () => {
      authentication.login.and.returnValue(Promise.resolve({ id: 42 }));
      await page.login();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith('');
    });

    it('displays an error message if the login fails', async () => {
      authentication.login.and.returnValue(
        Promise.reject({
          code: 'auth/wrong-password',
          message:
            'The password is invalid or the user does not have a password.'
        })
      );
      await page.login();
      expect(page.errorMessage).toEqual(
        'The password is invalid or the user does not have a password.'
      );
    });

    it('clears the password if the login fails', async () => {
      authentication.login.and.returnValue(
        Promise.reject({
          code: 'auth/wrong-password',
          message:
            'The password is invalid or the user does not have a password.'
        })
      );
      await page.login();
      expect(page.password).toBeFalsy();
    });
  });

  describe('password reset', () => {
    it('creates an alert', () => {
      page.handlePasswordReset();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    describe('the alert', () => {
      let params;
      beforeEach(async () => {
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
