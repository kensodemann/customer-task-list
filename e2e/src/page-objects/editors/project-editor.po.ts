import { EditorObjectBase } from './base.po';

export class ProjectEditor extends EditorObjectBase {
  constructor() {
    super('app-project-editor');
  }

  enterName(name: string) {
    this.enterInputText('#name-input', name);
  }

  enterDescription(description: string) {
    this.enterTextareaText('#description-textarea', description);
  }

  getName() {
    return this.getInputText('#name-input');
  }

  getDescription() {
    return this.getTextareaText('#description-textarea');
  }

  toggleIsActive() {
    this.clickButton('#is-active-checkbox');
  }

  getIsActive() {
    return this.getInputText('#is-active-checkbox');
  }
}
