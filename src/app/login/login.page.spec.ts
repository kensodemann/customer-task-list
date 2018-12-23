import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { createNavControllerMock } from '../../../test/mocks';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let authentication;
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let navController;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('calls the authentication login', () => {
      component.login();
      expect(authentication.login).toHaveBeenCalledTimes(1);
    });

    it('does not navigate if no user is returned', async () => {
      await component.login();
      expect(navController.navigateRoot).not.toHaveBeenCalled();
    });

    it('navigates to the main page if a user is returned', async () => {
      authentication.login.and.returnValue(Promise.resolve({ id: 42 }));
      await component.login();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith('');
    });
  });
});
