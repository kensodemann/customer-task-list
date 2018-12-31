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
} from 'test/mocks';

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
    component.allCustomers = [
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
      },
      {
        id: '320KWS',
        name: ' Kenmore ',
        description: 'They used to make stuff for some company called "Sears"',
        isActive: false
      }
    ];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      fixture.detectChanges();
      component.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('starts with a true active status', () => {
      expect(component.isActive).toEqual(true);
    });

    it('sets the title', () => {
      expect(component.title).toEqual('Add New Customer');
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
        (component.description = 'Cats like to sleep, even the bigger ones.'),
          (component.isActive = false);
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

    describe('check name', () => {
      it('sets a warning message if a customer by the same name exists', () => {
        component.name = 'Joe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('does the check case-insensitive', () => {
        component.name = 'jOe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores starting white-space', () => {
        component.name = '  Joe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        component.name = 'Kenmore ';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores ending white-space', () => {
        component.name = 'Joe  ';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        component.name = ' Kenmore';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('clears the error message if no matching customer', () => {
        component.name = 'Joe';
        component.checkName();
        expect(component.warningMessage).toBeTruthy();

        component.name = 'Jill';
        component.checkName();
        expect(component.warningMessage).toBeFalsy();
      });
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      component.customer = {
        id: '531LLS',
        name: 'Lillies and Cream',
        description: 'I have no idea what that would be',
        isActive: false
      };
      fixture.detectChanges();
    });

    it('sets the title', () => {
      expect(component.title).toEqual('Modify Customer');
    });

    it('initializes the name', () => {
      expect(component.name).toEqual('Lillies and Cream');
    });

    it('initializes the description', () => {
      expect(component.description).toEqual(
        'I have no idea what that would be'
      );
    });

    it('initializes the active flag', () => {
      expect(component.isActive).toEqual(false);
    });

    describe('save', () => {
      it('updates the customer', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.isActive = true;
        component.save();
        expect(customers.update).toHaveBeenCalledTimes(1);
      });

      it('passes the id, name, description, and isActive status', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.isActive = true;
        component.save();
        expect(customers.update).toHaveBeenCalledWith({
          id: '531LLS',
          name: 'The Dude',
          description: 'He does abide',
          isActive: true
        });
      });

      it('allows customers to be made inactive', () => {
        component.name = 'Lazy Leopard';
        (component.description = 'Cats like to sleep, even the bigger ones.'),
          (component.isActive = false);
        component.save();
        expect(customers.update).toHaveBeenCalledWith({
          id: '531LLS',
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

    describe('check name', () => {
      it('sets a warning message if a customer by the same name exists', () => {
        component.name = 'Joe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignore the customer with the same ID', () => {
        component.customer.id = '420HI';
        component.name = 'Joe';
        component.checkName();
        expect(component.warningMessage).toBeFalsy();
      });

      it('does the check case-insensitive', () => {
        component.name = 'jOe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores starting white-space', () => {
        component.name = '  Joe';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        component.name = 'Kenmore ';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores ending white-space', () => {
        component.name = 'Joe  ';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        component.name = ' Kenmore';
        component.checkName();
        expect(component.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('clears the error message if no matching customer', () => {
        component.name = 'Joe';
        component.checkName();
        expect(component.warningMessage).toBeTruthy();

        component.name = 'Jill';
        component.checkName();
        expect(component.warningMessage).toBeFalsy();
      });
    });
  });
});
