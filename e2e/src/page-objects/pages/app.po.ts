import { browser } from 'protractor';

export class AppPage {
  load() {
    return browser.get('/');
  }

  waitForPageNavigation() {
    browser.sleep(500);
  }
}
