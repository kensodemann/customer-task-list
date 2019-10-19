import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { NotesService } from '@app/services/firestore-data';
import { Note } from '@app/models';
import { NoteEditorComponent } from '@app/editors';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];

  @ViewChild(IonList, { static: true }) notesList: IonList;
  @Input() itemId: string;
  allNotes: Array<Note>;

  constructor(private alert: AlertController, private modal: ModalController, private notes: NotesService) {}

  ngOnInit() {
    this.subscriptions.push(this.notes.allFor(this.itemId).subscribe(n => (this.allNotes = n)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async add() {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: NoteEditorComponent,
      componentProps: { itemId: this.itemId }
    });
    m.present();
  }

  async delete(note: Note) {
    const a = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to permanently remove this note?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.notes.delete(note);
            this.notesList.closeSlidingItems();
          }
        },
        { text: 'No', role: 'cancel' }
      ]
    });
    return a.present();
  }

  async view(note: Note) {
    const m = await this.modal.create({
      backdropDismiss: false,
      component: NoteEditorComponent,
      componentProps: { note: note }
    });
    m.present();
  }
}
