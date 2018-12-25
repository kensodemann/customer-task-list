import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { CustomersPage } from './customers.page';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';

import { createCustomersServiceMock } from '../services/customers/customers.mock';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CustomersPage', () => {
  let customers;
  let customerList: Subject<Array<CustomerWithId>>;
  let modal;
  let modalController;
  let page: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    customerList = new Subject();
    customers.all.and.returnValue(customerList);
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modalController }
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
