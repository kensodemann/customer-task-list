import { CustomerPage } from '../page-objects/pages/customer.po';
import { CustomersPage } from '../page-objects/pages/customers.po';
import { CustomerEditor } from '../page-objects/editors/customer-editor.po';
import { NoteEditor } from '../page-objects/editors/note-editor.po';

import { browser } from 'protractor';

export function registerCustomerTests(
  customer: CustomerPage,
  customers: CustomersPage,
  customerEditor: CustomerEditor,
  noteEditor: NoteEditor
) {
  describe('Customers', () => {
    beforeEach(() => {
      customers.load();
      customers.waitUntilVisible();
    });

    it('shows the existing customers in alphabetical order', () => {
      const c = customers.getCustomers();
      expect(c.count()).toEqual(7);
      expect(c.get(0).getText()).toContain('A+ Storage');
      expect(c.get(1).getText()).toContain('Burger Chef');
      expect(c.get(2).getText()).toContain('Institutional Food Service');
      expect(c.get(3).getText()).toContain('JP Morgan Chase Bank');
      expect(c.get(4).getText()).toContain(`Mike's Modal Meltdown`);
      expect(c.get(5).getText()).toContain('Penta Technologies');
      expect(c.get(6).getText()).toContain('Xeno Tech Solutions');
    });

    describe('clicking add customer', () => {
      it('displays the customer editor', () => {
        customers.clickAddButton();
        customerEditor.waitUntilVisible();
        expect(customerEditor.getName()).toBeFalsy();
        expect(customerEditor.getDescription()).toBeFalsy();
        expect(customerEditor.getIsActive()).toBeTruthy();
      });

      it('allows entry of name and description', () => {
        customers.clickAddButton();
        customerEditor.waitUntilVisible();
        customerEditor.enterName('a name');
        customerEditor.enterDescription('this is a description');
        expect(customerEditor.getName()).toEqual('a name');
        expect(customerEditor.getDescription()).toEqual(
          'this is a description'
        );
      });

      it('allows the active flag to be toggled', () => {
        customers.clickAddButton();
        customerEditor.waitUntilVisible();
        customerEditor.toggleIsActive();
        expect(customerEditor.getIsActive()).toBeFalsy();
      });
    });

    describe('clicking a customer', () => {
      beforeEach(() => {
        const c = customers.getCustomers();
        c.get(3).click();
        customer.waitUntilVisible();
      });

      it('loads the customer page', () => {
        expect(customer.nameText).toContain('JP Morgan Chase Bank');
        expect(customer.descriptionText).toContain(
          'One of the larger banks in the banking industry.'
        );
        expect(customer.isActiveText).toContain('true');
      });

      describe('clicking back', () => {
        it('goes back to the customers list page', () => {
          customer.clickBackbutton();
          customer.waitUntilInvisible();
          customers.waitUntilVisible();
        });
      });

      describe('clicking add note', () => {
        it('loads the notes editor', () => {
          customer.clickAddNote();
          noteEditor.waitUntilVisible();
          expect(noteEditor.getNoteText()).toBeFalsy();
        });

        it('allows the entry of note text', () => {
          customer.clickAddNote();
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText('this is a happy note');
          expect(noteEditor.getNoteText()).toEqual('this is a happy note');
        });
      });

      describe('clicking an existing note', () => {
        it('loads the notes editor with the note', () => {
          customer.clickNote(1);
          noteEditor.waitUntilVisible();
          expect(noteEditor.getNoteText()).toEqual(
            'This is a note just to make sure that we have three of them.'
          );
        });

        it('allows the entry of more note text', () => {
          customer.clickNote(1);
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText(' And this is new text.');
          expect(noteEditor.getNoteText()).toEqual(
            'This is a note just to make sure that we have three of them. And this is new text.'
          );
        });
      });

      describe('clicking the edit customer button', () => {
        it('loads the editor page with the customer information', () => {
          customer.clickEditButton();
          customerEditor.waitUntilVisible();
          expect(customerEditor.getName()).toEqual('JP Morgan Chase Bank');
          expect(customerEditor.getDescription()).toEqual(
            'One of the larger banks in the banking industry.'
          );
          expect(customerEditor.getIsActive()).toBeTruthy();
        });

        it('allows the customer data to be changed', () => {
          customer.clickEditButton();
          customerEditor.waitUntilVisible();
          customerEditor.toggleIsActive();
          customerEditor.enterDescription(' This is more description.');
          customerEditor.enterName(' This is extra for the name.');
          expect(customerEditor.getName()).toEqual('JP Morgan Chase Bank This is extra for the name.');
          expect(customerEditor.getDescription()).toEqual(
            'One of the larger banks in the banking industry. This is more description.'
          );
          expect(customerEditor.getIsActive()).toBeFalsy();
        });
      });
    });
  });
}
