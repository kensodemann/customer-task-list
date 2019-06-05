import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Task } from '../../../models/task';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreDataService } from '../firestore-data-service';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends FirestoreDataService<Task> {
  constructor(private firestore: AngularFirestore) {
    super(firestore, 'tasks');
  }

  forCustomer(id: string): Observable<Array<Task>> {
    return this.firestore
      .collection('tasks', ref => ref.where('customerId', '==', id))
      .snapshotChanges()
      .pipe(map(this.actionsToData));
  }
}
