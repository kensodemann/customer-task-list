import { EditorObjectBase } from './base.po';

export class NoteEditor extends EditorObjectBase {
  constructor() {
    super('app-note-editor');
  }

  enterNoteText(text: string) {
    this.enterTextareaText('#note-textarea', text);
  }
}
