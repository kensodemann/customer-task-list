import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Note } from '@app/models';
import { Observable } from 'rxjs';

import { FirestoreDataService } from '../firestore-data-service';

@Injectable({
  providedIn: 'root'
})
export class NotesService extends FirestoreDataService<Note> {
  constructor(private firestore: AngularFirestore) {
    super(firestore, 'notes');
  }

  allFor(id: string): Observable<Array<Note>> {
    return this.firestore
      .collection('notes', ref => ref.where('itemId', '==', id))
      .snapshotChanges()
      .pipe(map(this.actionsToData));
  }
}
