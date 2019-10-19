import { browser, by, element, ExpectedConditions } from 'protractor';
import { PageObjectBase } from './base.po';

export class ProjectsPage extends PageObjectBase {
  constructor() {
    super('app-projects', '/tabs/projects');
  }

  clickAddButton() {
    this.clickButton('#add-button');
  }

  clickOnProject(idx: number) {
    const c = this.getProjects();
    const el = c.get(idx);
    browser.wait(ExpectedConditions.elementToBeClickable(el));
    el.click();
  }

  getProjects() {
    this.waitUntilPresent();
    browser.sleep(200);
    return element.all(by.css(`${this.tag} ion-item`));
  }
}
