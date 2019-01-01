import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { CustomerPage } from './customer.page';
import { CustomersService } from '../services/customers/customers.service';

import { createCustomersServiceMock  } from '../services/customers/customers.mock';
import {
  createActivatedRouteMock,
  createNavControllerMock
} from '../../../test/mocks';

describe('CustomerPage', () => {
  let component: CustomerPage;
  let customers;
  let fixture: ComponentFixture<CustomerPage>;
  let navController;
  let route;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    navController = createNavControllerMock();
    route = createActivatedRouteMock();
    TestBed.configureTestingModule({
      declarations: [CustomerPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CustomersService, useValue: customers },
        { provide: NavController, useValue: navController }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('gets the ID from the route', () => {
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('get the customer for the id', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(customers.get).toHaveBeenCalledTimes(1);
  });

  it('assigns the customer', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    customers.get.and.returnValue(of({
      id: '314159PI',
      name: 'Cherry',
      description: 'Makers of really tasty pi',
      isActive: true
    }));
    fixture.detectChanges();
    expect(component.customer).toEqual({
      id: '314159PI',
      name: 'Cherry',
      description: 'Makers of really tasty pi',
      isActive: true
    });
  });
});
