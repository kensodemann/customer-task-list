import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { CustomersPage } from './customers.page';
import { CustomersService } from '../services/firestore-data/customers/customers.service';
import { CustomerWithId } from '../models/customer';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { createCustomersServiceMock } from '../services/firestore-data/customers/customers.mock';
import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';

describe('CustomersPage', () => {
  let customerList: Subject<Array<CustomerWithId>>;
  let list: Array<CustomerWithId>;
  let modal;
  let page: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    customerList = new Subject();
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CustomersService, useFactory: createCustomersServiceMock },
        {
          provide: ModalController,
          useFactory: () =>
            createOverlayControllerMock('ModalController', modal)
        },
        { provide: NavController, useFactory: createNavControllerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const customers = TestBed.get(CustomersService);
    customers.all.and.returnValue(customerList);
    list = [
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: false
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      }
    ];
    fixture = TestBed.createComponent(CustomersPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  it('sets up an observable on the customers', () => {
    const customers = TestBed.get(CustomersService);
    expect(customers.all).toHaveBeenCalledTimes(1);
  });

  it('sets all customers on changes to the customers', () => {
    customerList.next(list);
    expect(page.allCustomers).toEqual(list);
  });

  it('sorts the customers by name', () => {
    customerList.next([
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      },
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: true
      },
      {
        id: '3895WUT',
        name: `Hello Underdog`,
        description: 'Underwear for your pooch',
        isActive: true
      },
      {
        id: '12345',
        name: `aa bus lines`,
        description: 'The best bus line for your apparently lacking money',
        isActive: true
      }
    ]);
    expect(page.allCustomers).toEqual([
      {
        id: '12345',
        name: `aa bus lines`,
        description: 'The best bus line for your apparently lacking money',
        isActive: true
      },
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: true
      },
      {
        id: '3895WUT',
        name: `Hello Underdog`,
        description: 'Underwear for your pooch',
        isActive: true
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      }
    ]);
  });

  describe('add customer', () => {
    it('creates a modal', () => {
      const modalController = TestBed.get(ModalController);
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component', () => {
      const modalController = TestBed.get(ModalController);
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent
      });
    });

    it('presents the modal', async () => {
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('view customer', () => {
    it('navigates to the customer', () => {
      const navController = TestBed.get(NavController);
      page.view({
        id: '4273',
        name: 'Dominos',
        description: 'Pizza apps that rock, the pizza not so much',
        isActive: true
      });
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith([
        'customer',
        '4273'
      ]);
    });
  });
});
