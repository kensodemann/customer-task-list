import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import firebase from 'firebase/app';

import { Note } from '@app/models';
import { NotesService } from '@app/services/firestore-data';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit {
  title: string;

  note: Note;
  itemId: string;
  text: string;

  constructor(private modal: ModalController, private notes: NotesService) {}

  ngOnInit() {
    if (this.note) {
      this.title = 'Note';
      this.text = this.note.text;
    } else {
      this.title = 'Add New Note';
    }
  }

  close() {
    this.modal.dismiss();
  }

  save() {
    const note = this.noteOjbect();
    if (this.note) {
      this.notes.update(note as Note);
    } else {
      this.notes.add(note);
    }
    this.modal.dismiss();
  }

  private noteOjbect(): Note {
    const note: Note = {
      text: this.text,
      itemId: this.note ? this.note.itemId : this.itemId,
      enteredOn: this.note
        ? this.note.enteredOn
        : new firebase.firestore.Timestamp(this.getSeconds(), 0),
    };

    if (this.note) {
      note.id = this.note.id;
    }

    return note;
  }

  private getSeconds(): number {
    return Math.round(Date.now() / 1000);
  }
}
