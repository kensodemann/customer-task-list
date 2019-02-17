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

    it('starts with an empty list', () => {
      const c = customers.getCustomers();
      expect(c.count()).toEqual(0);
    });

    describe('customer editor', () => {
      it('does not add if the user cancels', () => {
        customers.clickAddButton();
        customerEditor.waitUntilVisible();
        customerEditor.enterName('Discount Fish');
        customerEditor.enterDescription(
          'The fish are cheap, but they may not be all that fresh'
        );
        customerEditor.clickCancel();
        const c = customers.getCustomers();
        expect(c.count()).toEqual(0);
      });

      [
        {
          name: 'Discount Fish',
          description: 'The fish are cheap, but they may not be all that fresh',
          isActive: true
        },
        {
          name: 'Zoo Trends',
          description: 'Come for the animals, stay for the peanuts',
          isActive: true
        },
        {
          name: 'Albatros Airlines',
          description: 'Our services is like a dead bird hung around your neck',
          isActive: true
        },
        {
          name: 'Inactive Pete',
          description: 'Like Stinky Pete, but far less actively stinky',
          isActive: false
        }
      ].forEach(c => {
        it(`handles the adding of customer ${c.name}`, () => {
          customers.clickAddButton();
          customerEditor.waitUntilVisible();
          customerEditor.enterName(c.name);
          customerEditor.enterDescription(c.description);
          if (!c.isActive) {
            customerEditor.toggleActive();
          }
          customerEditor.clickSave();
          browser.sleep(350);
        });
      });
    });

    it('displays the customers in alphabetical order', () => {
      const c = customers.getCustomers();
      expect(c.count()).toEqual(4);
      expect(c.get(0).getText()).toContain('Albatros Airlines');
      expect(c.get(1).getText()).toContain('Discount Fish');
      expect(c.get(2).getText()).toContain('Inactive Pete');
      expect(c.get(3).getText()).toContain('Zoo Trends');
    });

    describe('clicking on a customer', () => {
      it('opens the customer page', () => {
        customers.clickOnCustomer(1);
        customer.waitUntilVisible();
      });

      it('displays information about the clicked customer', () => {
        customers.clickOnCustomer(1);
        customer.waitUntilVisible();
        expect(customer.nameText).toEqual('Name: Discount Fish');
        expect(customer.descriptionText).toContain('The fish are cheap');
        expect(customer.isActiveText).toEqual('Is Active: true');
      });

      describe('clicking add note', () => {
        beforeEach(() => {
          customers.clickOnCustomer(1);
          customer.waitUntilVisible();
        });

        it('opens the notes editor', () => {
          customer.clickAddNote();
          noteEditor.waitUntilVisible();
        });

        it('does not add the note if canceled', () => {
          customer.clickAddNote();
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText('This is just a note, nothing more');
          noteEditor.clickCancel();
          noteEditor.waitUntilNotPresent();
          expect(customer.getNotes().count()).toEqual(0);
        });

        [
          'This is just a note, nothing more',
          'another note',
          'I just called to say I love you',
          'mmmmm, coffee...'
        ].forEach((n, i) => {
          it(`adds note ${i}`, () => {
            customer.clickAddNote();
            noteEditor.waitUntilVisible();
            noteEditor.enterNoteText(n);
            noteEditor.clickSave();
          });
        });
      });

      it('shows the entered notes', () => {
        customers.clickOnCustomer(1);
        customer.waitUntilVisible();
        expect(customer.getNotes().count()).toEqual(4);
      });

      describe('clicking a note', () => {
        beforeEach(() => {
          customers.clickOnCustomer(1);
          customer.waitUntilVisible();
        });

        it('opens the notes editor', () => {
          customer.clickNote(2);
          noteEditor.waitUntilVisible();
        });

        it('allows save of changes', () => {
          customer.clickNote(2);
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText('You no add this');
          noteEditor.clickCancel();
        });

        it('allows save of changes', () => {
          customer.clickNote(2);
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText(' Now we are adding to the note');
          noteEditor.clickSave();
        });

        it('shows the changes to the notes', () => {
          const notes = customer.getNotes();
          const el = notes.get(2);
          expect(el.getText()).toContain('Now we are adding to the note');
          expect(el.getText()).not.toContain('You no add this');
        });
      });
    });
  });
}
