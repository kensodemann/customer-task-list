import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { CustomersPage } from './customers.page';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { createCustomersServiceMock } from '../services/customers/customers.mock';
import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';

describe('CustomersPage', () => {
  let customers;
  let customerList: Subject<Array<CustomerWithId>>;
  let list: Array<CustomerWithId>;
  let modal;
  let modalController;
  let navController;
  let page: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    customerList = new Subject();
    customers.all.and.returnValue(customerList);
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modalController },
        { provide: NavController, useValue: navController }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
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
        description: 'Some guy named Joe who sells week on my street corner',
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
    expect(customers.all).toHaveBeenCalledTimes(1);
  });

  it('changes the customer list', () => {
    customerList.next(list);
    expect(page.allCustomers).toEqual(list);
  });

  describe('add customer', () => {
    it('creates a modal', () => {
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component', () => {
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
      page.view({
        id: '4273',
        name: 'Dominos',
        description: 'Pizza apps that rock, the pizza not so much',
        isActive: true
      });
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith(['customer', '4273']);
    });
  });
});
