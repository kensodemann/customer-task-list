import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  DocumentChangeAction
} from '@angular/fire/firestore';

import { Task, TaskWithId } from '../../models/task';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private collection: AngularFirestoreCollection<Task>;

  constructor(private firestore: AngularFirestore) {
    this.collection = this.firestore.collection('tasks');
  }

  all(): Observable<Array<TaskWithId>> {
    return this.collection.snapshotChanges().pipe(map(this.actionsToTasks));
  }

  forCustomer(id: string): Observable<Array<TaskWithId>> {
    return this.firestore
      .collection('tasks', ref => ref.where('customerId', '==', id))
      .snapshotChanges()
      .pipe(map(this.actionsToTasks));
  }

  get(id: string): Observable<TaskWithId> {
    return this.collection
      .doc<Task>(id)
      .valueChanges()
      .pipe(
        map(item => {
          return { id: id, ...item };
        })
      );
  }

  private actionsToTasks(
    actions: Array<DocumentChangeAction<Task>>
  ): Array<TaskWithId> {
    return actions.map(a => {
      const data = a.payload.doc.data() as Task;
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  }

  add(task: Task): Promise<DocumentReference> {
    return this.collection.add(task);
  }

  update(task: TaskWithId): Promise<void> {
    const t = { ...task };
    delete t.id;
    return this.collection.doc(task.id).set(t);
  }

  delete(task: TaskWithId): Promise<void> {
    return this.collection.doc(task.id).delete();
  }
}
