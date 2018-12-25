import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { CustomersPage } from './customers.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { CustomersService } from '../services/customers/customers.service';
import { createCustomersServiceMock } from '../services/customers/customers.mock';
import { CustomerWithId } from '../models/customer';

describe('CustomersPage', () => {
  let authentication;
  let customers;
  let customerList: Subject<Array<CustomerWithId>>;
  let page: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    customers = createCustomersServiceMock();
    customerList = new Subject();
    customers.all.and.returnValue(customerList);
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: CustomersService, useValue: customers }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  it('sets up an observable on the tasks', () => {
    expect(customers.all).toHaveBeenCalledTimes(1);
  });

  it('changes the task list', () => {
    const list = [
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food'
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner'
      }
    ];
    customerList.next(list);
    expect(page.allCustomers).toEqual(list);
  });
});
