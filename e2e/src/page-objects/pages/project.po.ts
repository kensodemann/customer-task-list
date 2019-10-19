import { by, browser, element, ExpectedConditions } from 'protractor';
import { PageObjectBase } from './base.po';

export class ProjectPage extends PageObjectBase {
  constructor() {
    super('app-project', '/project/:id');
  }

  get nameText() {
    const root = this.rootElement();
    return root.element(by.css('#name-section')).getText();
  }

  get descriptionText() {
    const root = this.rootElement();
    return root.element(by.css('#description-section')).getText();
  }

  get isActiveText() {
    const root = this.rootElement();
    return root.element(by.css('#is-active-section')).getText();
  }

  clickAddNote() {
    this.clickButton('.notes-list ion-button');
  }

  clickBackbutton() {
    this.clickButton('ion-back-button');
  }

  clickEditButton() {
    this.clickButton('#edit-button');
  }

  clickNote(idx: number) {
    const notes = this.getNotes();
    const note = notes.get(idx);
    const el = note.element(by.css('ion-item'));
    browser.wait(ExpectedConditions.elementToBeClickable(el), 3000);
    el.click();
  }

  getNotes() {
    return element.all(by.css(`.notes-list app-note-list-item`));
  }
}
