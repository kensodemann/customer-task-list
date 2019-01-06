import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { createNavControllerMock } from 'test/mocks';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let authentication;
  let page: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let navController;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      imports: [FormsModule, IonicModule],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
});
