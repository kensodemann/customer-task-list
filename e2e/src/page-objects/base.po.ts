import { browser, by, element, ExpectedConditions } from 'protractor';

export class ElementObjectBase {
  protected tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  rootElement() {
    return element(by.css(this.tag));
  }

  waitUntilInvisible() {
    browser.wait(ExpectedConditions.invisibilityOf(this.rootElement()), 1000);
  }

  waitUntilPresent() {
    browser.wait(ExpectedConditions.presenceOf(this.rootElement()), 1000);
  }

  waitUntilNotPresent() {
    browser.wait(
      ExpectedConditions.not(ExpectedConditions.presenceOf(this.rootElement())),
      1000
    );
  }

  waitUntilVisible() {
    browser.wait(ExpectedConditions.visibilityOf(this.rootElement()), 1000);
  }

  getTitle() {
    return element(by.css(`${this.tag} ion-title`)).getText();
  }

  protected enterInputText(sel: string, text: string) {
    const el = element(by.css(`${this.tag} ${sel}`));
    const inp = el.element(by.css('input'));
    inp.sendKeys(text);
  }

  protected enterTextareaText(sel: string, text: string) {
    const el = element(by.css(`${this.tag} ${sel}`));
    const inp = el.element(by.css('textarea'));
    inp.sendKeys(text);
  }

  protected clickButton(sel: string) {
    const el = element(by.css(`${this.tag} ${sel}`));
    browser.wait(ExpectedConditions.elementToBeClickable(el));
    el.click();
  }
}
