import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Note } from '@app/models';

@Component({
  selector: 'app-note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss']
})
export class NoteListItemComponent {
  @Input() note: Note;
  @Output() delete: EventEmitter<void>;
  @Output() view: EventEmitter<void>;

  constructor() {
    this.delete = new EventEmitter();
    this.view = new EventEmitter();
  }

  get noteText() {
    const maxlen = 160;
    if (this.note.text.length <= maxlen) {
      return this.note.text;
    } else {
      return this.note.text.substring(0, maxlen - 3) + '...';
    }
  }
}
