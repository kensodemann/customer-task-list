import { browser } from 'protractor';
import { ElementObjectBase } from '../base.po';

export class PageObjectBase extends ElementObjectBase {
  private path: string;

  constructor(tag: string, path: string) {
    super(tag);
    this.path = path;
  }

  load() {
    return browser.get(this.path);
  }
}
