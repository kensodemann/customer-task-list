import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  DocumentReference
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Note, NoteWithId } from '../../models/note';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private collection: AngularFirestoreCollection<Note>;

  constructor(private firestore: AngularFirestore) {
    this.collection = this.firestore.collection('notes');
  }

  allFor(id: string): Observable<Array<NoteWithId>> {
    return this.firestore
      .collection('notes', ref => ref.where('itemId', '==', id))
      .snapshotChanges()
      .pipe(map(this.actionsToNotes));
  }

  private actionsToNotes(
    actions: Array<DocumentChangeAction<Note>>
  ): Array<NoteWithId> {
    return actions.map(a => {
      const data = a.payload.doc.data() as Note;
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  }

  get(id: string): Observable<NoteWithId> {
    return this.collection
      .doc<Note>(id)
      .valueChanges()
      .pipe(map(n => ({ id: id, ...n })));
  }

  add(note: Note): Promise<DocumentReference> {
    return this.collection.add(note);
  }

  update(note: NoteWithId): Promise<void> {
    const n = { ...note };
    delete n.id;
    return this.collection.doc(note.id).set(n);
  }

  delete(note: NoteWithId): Promise<void> {
    return this.collection.doc(note.id).delete();
  }
}
