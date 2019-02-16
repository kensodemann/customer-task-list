import { AboutPage } from './page-objects/pages/about.po';
import { AppPage } from './page-objects/pages/app.po';
import { CustomersPage } from './page-objects/pages/customers.po';
import { CustomerEditor } from './page-objects/editors/customer-editor.po';
import { LoginPage } from './page-objects/pages/login.po';
import { MenuPage } from './page-objects/pages/menu.po';
import { TasksPage } from './page-objects/pages/tasks.po';

import { browser } from 'protractor';

describe('Customers', () => {
  let app: AppPage;
  let customers: CustomersPage;
  let customerEditor: CustomerEditor;
  let menu: MenuPage;

  beforeAll(() => {
    app = new AppPage();
    customers = new CustomersPage();
    customerEditor = new CustomerEditor();
    menu = new MenuPage();
    const login = new LoginPage();
    const tasks = new TasksPage();
    login.load();
    login.waitUntilPresent();
    login.enterEMail('test@test.com');
    login.enterPassword('testtest');
    login.clickSignIn();
    tasks.waitUntilVisible();
  });

  afterAll(() => {
    const about = new AboutPage();
    app.load();
    menu.clickAbout();
    about.waitUntilVisible();
    about.clickLogout();
  });

  beforeEach(() => {
    app.load();
    menu.clickCustomers();
    customers.waitUntilVisible();
  });

  it('starts with an empty list', () => {
    const c = customers.getCustomers();
    expect(c.count()).toEqual(0);
  });

  describe('adding customers', () => {
    it('opens the customer editor', () => {
      customers.clickAddButton();
      customerEditor.waitUntilVisible();
    });

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

    it('adds the customer if the user saves', () => {
      customers.clickAddButton();
      customerEditor.waitUntilVisible();
      customerEditor.enterName('Discount Fish');
      customerEditor.enterDescription(
        'The fish are cheap, but they may not be all that fresh'
      );
      customerEditor.clickSave();
      browser.sleep(350);
      customers.load();
      customers.waitUntilVisible();
      const c = customers.getCustomers();
      expect(c.count()).toEqual(1);
    });

    it('displays the customers in alphabetical order', () => {
      customers.clickAddButton();
      customerEditor.waitUntilVisible();
      customerEditor.enterName('Zoo Trends');
      customerEditor.enterDescription(
        'Come for the animals, stay for the peanuts'
      );
      customerEditor.clickSave();
      browser.sleep(350);
      customers.load();
      customers.waitUntilVisible();
      customers.clickAddButton();
      customerEditor.waitUntilVisible();
      customerEditor.enterName('Albatros Airlines');
      customerEditor.enterDescription(
        'Our services is like a dead bird hung around your neck'
      );
      customerEditor.clickSave();
      browser.sleep(350);
      customers.load();
      customers.waitUntilVisible();
      const c = customers.getCustomers();
      expect(c.get(0).getText()).toContain('Albatros Airlines');
      expect(c.get(1).getText()).toContain('Discount Fish');
      expect(c.get(2).getText()).toContain('Zoo Trends');
      expect(c.count()).toEqual(3);
    });
  });
});
