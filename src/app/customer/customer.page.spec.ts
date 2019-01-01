import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { CustomerPage } from './customer.page';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';

import { createCustomersServiceMock } from '../services/customers/customers.mock';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CustomerPage', () => {
  let component: CustomerPage;
  let customers;
  let fixture: ComponentFixture<CustomerPage>;
  let modal;
  let modalController;
  let navController;
  let route;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    navController = createNavControllerMock();
    route = createActivatedRouteMock();
    TestBed.configureTestingModule({
      declarations: [CustomerPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modalController },
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
    customers.get.and.returnValue(
      of({
        id: '314159PI',
        name: 'Cherry',
        description: 'Makers of really tasty pi',
        isActive: true
      })
    );
    fixture.detectChanges();
    expect(component.customer).toEqual({
      id: '314159PI',
      name: 'Cherry',
      description: 'Makers of really tasty pi',
      isActive: true
    });
  });

  describe('edit customer', () => {
    const customer: CustomerWithId = {
      id: '4273',
      name: 'Dominos',
      description: 'Pizza apps that rock, the pizza not so much',
      isActive: true
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('4273');
      customers.get.and.returnValue(of(customer));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      component.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component and passes the customer', () => {
      component.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent,
        componentProps: { customer: customer }
      });
    });

    it('presents the modal', async () => {
      await component.edit();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
