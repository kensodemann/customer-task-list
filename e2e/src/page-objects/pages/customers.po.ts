import { browser, by, element } from 'protractor';
import { PageObjectBase } from './base.po';

export class CustomersPage extends PageObjectBase {
  constructor() {
    super('app-customers', '/tabs/customers');
  }

  clickAddButton() {
    this.clickButton('#add-button');
  }

  getCustomers() {
    this.waitUntilPresent();
    browser.sleep(200);
    return element.all(by.css(`${this.tag} ion-item`));
  }
}
