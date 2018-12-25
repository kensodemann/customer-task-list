import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { CustomerEditorComponent } from './customer-editor.component';
import { CustomersService } from '../../services/customers/customers.service';

import { createCustomersServiceMock } from '../../services/customers/customers.mock';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../../test/mocks';

describe('CustomerEditorComponent', () => {
  let component: CustomerEditorComponent;
  let fixture: ComponentFixture<CustomerEditorComponent>;
  let customers;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayControllerMock(
      'ModalController',
      createOverlayElementMock('Modal')
    );
    customers = createCustomersServiceMock();
    TestBed.configureTestingModule({
      declarations: [CustomerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modal }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with a true active status', () => {
    expect(component.isActive).toEqual(true);
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      component.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('adds the customer', () => {
      component.name = 'The Dude';
      component.description = 'He does abide';
      component.isActive = true;
      component.save();
      expect(customers.add).toHaveBeenCalledTimes(1);
    });

    it('passes the name, description, and isActive status', () => {
      component.name = 'The Dude';
      component.description = 'He does abide';
      component.isActive = true;
      component.save();
      expect(customers.add).toHaveBeenCalledWith({
        name: 'The Dude',
        description: 'He does abide',
        isActive: true
      });
    });

    it('allows inactive customers to be created', () => {
      component.name = 'Lazy Leopard';
      component.description = 'Cats like to sleep, even the bigger ones.',
      component.isActive = false;
      component.save();
      expect(customers.add).toHaveBeenCalledWith({
        name: 'Lazy Leopard',
        description: 'Cats like to sleep, even the bigger ones.',
        isActive: false
      });
    });

    it('dismisses the modal', async () => {
      await component.save();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
