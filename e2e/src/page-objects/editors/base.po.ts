import { ElementObjectBase } from '../base.po';

export class EditorObjectBase extends ElementObjectBase {
  constructor(tag: string) {
    super(tag);
  }

  clickCancel() {
    this.clickButton('#cancel-button');
  }
}
