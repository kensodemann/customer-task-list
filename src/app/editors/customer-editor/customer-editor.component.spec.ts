import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { CustomerEditorComponent } from './customer-editor.component';
import { CustomersService } from '../../services/customers/customers.service';
import { CustomerWithId } from '../../models/customer';

import { createCustomersServiceMock } from '../../services/customers/customers.mock';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';

describe('CustomerEditorComponent', () => {
  let editor: CustomerEditorComponent;
  let fixture: ComponentFixture<CustomerEditorComponent>;
  let customerList: Subject<Array<CustomerWithId>>;
  let customers;
  let list;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayControllerMock(
      'ModalController',
      createOverlayElementMock('Modal')
    );
    customers = createCustomersServiceMock();
    customerList = new Subject();
    customers.all.and.returnValue(customerList);
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
    editor = fixture.componentInstance;
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
    expect(editor).toBeTruthy();
  });

  it('sets up an observable on the customers', () => {
    fixture.detectChanges();
    expect(customers.all).toHaveBeenCalledTimes(1);
  });

  it('changes the customer list', () => {
    fixture.detectChanges();
    customerList.next(list);
    expect(editor.allCustomers).toEqual(list);
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
      customerList.next(list);
    });

    it('starts with a true active status', () => {
      expect(editor.isActive).toEqual(true);
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Add New Customer');
    });

    describe('save', () => {
      it('adds the customer', () => {
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(customers.add).toHaveBeenCalledTimes(1);
      });

      it('passes the name, description, and isActive status', () => {
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(customers.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          isActive: true
        });
      });

      it('allows inactive customers to be created', () => {
        editor.name = 'Lazy Leopard';
        (editor.description = 'Cats like to sleep, even the bigger ones.'),
          (editor.isActive = false);
        editor.save();
        expect(customers.add).toHaveBeenCalledWith({
          name: 'Lazy Leopard',
          description: 'Cats like to sleep, even the bigger ones.',
          isActive: false
        });
      });

      it('dismisses the modal', async () => {
        await editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a customer by the same name exists', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('does the check case-insensitive', () => {
        editor.name = 'jOe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores starting white-space', () => {
        editor.name = '  Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        editor.name = 'Kenmore ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores ending white-space', () => {
        editor.name = 'Joe  ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        editor.name = ' Kenmore';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('clears the error message if no matching customer', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toBeTruthy();

        editor.name = 'Jill';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      editor.customer = {
        id: '531LLS',
        name: 'Lillies and Cream',
        description: 'I have no idea what that would be',
        isActive: false
      };
      fixture.detectChanges();
      customerList.next(list);
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Modify Customer');
    });

    it('initializes the name', () => {
      expect(editor.name).toEqual('Lillies and Cream');
    });

    it('initializes the description', () => {
      expect(editor.description).toEqual(
        'I have no idea what that would be'
      );
    });

    it('initializes the active flag', () => {
      expect(editor.isActive).toEqual(false);
    });

    describe('save', () => {
      it('updates the customer', () => {
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(customers.update).toHaveBeenCalledTimes(1);
      });

      it('passes the id, name, description, and isActive status', () => {
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(customers.update).toHaveBeenCalledWith({
          id: '531LLS',
          name: 'The Dude',
          description: 'He does abide',
          isActive: true
        });
      });

      it('allows customers to be made inactive', () => {
        editor.name = 'Lazy Leopard';
        (editor.description = 'Cats like to sleep, even the bigger ones.'),
          (editor.isActive = false);
        editor.save();
        expect(customers.update).toHaveBeenCalledWith({
          id: '531LLS',
          name: 'Lazy Leopard',
          description: 'Cats like to sleep, even the bigger ones.',
          isActive: false
        });
      });

      it('dismisses the modal', async () => {
        await editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a customer by the same name exists', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignore the customer with the same ID', () => {
        editor.customer.id = '420HI';
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });

      it('does the check case-insensitive', () => {
        editor.name = 'jOe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores starting white-space', () => {
        editor.name = '  Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        editor.name = 'Kenmore ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('ignores ending white-space', () => {
        editor.name = 'Joe  ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );

        editor.name = ' Kenmore';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a customer with this name already exists'
        );
      });

      it('clears the error message if no matching customer', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toBeTruthy();

        editor.name = 'Jill';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });
    });
  });
});
