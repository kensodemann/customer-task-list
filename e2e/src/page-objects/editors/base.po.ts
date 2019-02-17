import { ElementObjectBase } from '../base.po';
import { element, by, browser, ExpectedConditions } from 'protractor';

export class EditorObjectBase extends ElementObjectBase {
  constructor(tag: string) {
    super(tag);
  }

  clickCancel() {
    this.clickButton('#cancel-button');
  }

  clickSave() {
    this.clickButton('#save-button');
  }
}
