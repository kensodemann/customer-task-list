import { by, element } from 'protractor';
import { PageObjectBase } from './base.po';

export class AboutPage extends PageObjectBase {
  constructor() {
    super('app-about', '/tabs/about');
  }

  clickLogout() {
    const el = element(by.id('logout-button'));
    el.click();
  }
}
