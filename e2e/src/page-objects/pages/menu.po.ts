import { by, element } from 'protractor';

export class MenuPage {
  clickAbout() {
    return element(by.css('#menu-item-about')).click();
  }

  clickCustomers() {
    return element(by.css('#menu-item-customers')).click();
  }

  clickTasks() {
    return element(by.css('#menu-item-tasks')).click();
  }

  getTitle() {
    return element(by.css('ion-menu ion-title')).getText();
  }
}
