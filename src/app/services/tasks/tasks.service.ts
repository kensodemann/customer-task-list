import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/firestore';

import { Task, TaskWithId } from '../../models/task';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private collection: AngularFirestoreCollection<Task>;

  constructor(firestore: AngularFirestore) {
    this.collection = firestore.collection('tasks');
  }

  all(): Observable<Array<TaskWithId>> {
    return this.collection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
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
