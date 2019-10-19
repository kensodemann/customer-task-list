import { by, element } from 'protractor';

export class MenuPage {
  clickAbout() {
    return element(by.css('#menu-item-about')).click();
  }

  clickProjects() {
    return element(by.css('#menu-item-projects')).click();
  }

  clickTasks() {
    return element(by.css('#menu-item-tasks')).click();
  }

  getTitle() {
    return element(by.css('ion-menu ion-title')).getText();
  }
}
