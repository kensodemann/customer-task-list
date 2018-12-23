import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPage } from './customers.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';

describe('CustomersPage', () => {
  let authentication;
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: AuthenticationService, useValue: authentication }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
