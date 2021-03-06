import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { Task } from '@app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends FirestoreDataService<Task> {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  forProject(id: string): Observable<Array<Task>> {
    return this.firestore
      .collection('tasks', ref => ref.where('projectId', '==', id))
      .snapshotChanges()
      .pipe(map(this.actionsToData));
  }

  protected getCollection(): AngularFirestoreCollection<Task> {
    return this.firestore.collection('tasks');
  }
}
