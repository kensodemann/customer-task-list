import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObjectBase } from './base.po';

export class CustomersPage extends PageObjectBase {
  constructor() {
    super('app-customers', '/tabs/customers');
  }

  clickAddButton() {
    this.clickButton('#add-button');
  }

  clickOnCustomer(idx: number) {
    const c = this.getCustomers();
    const el = c.get(idx);
    browser.wait(ExpectedConditions.elementToBeClickable(el));
    el.click();
  }

  getCustomers() {
    this.waitUntilPresent();
    browser.sleep(200);
    return element.all(by.css(`${this.tag} ion-item`));
  }
}
