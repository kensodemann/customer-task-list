import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
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

  delete(task: TaskWithId): Promise<void> {
    return this.firestore.doc(`tasks/${task.id}`).delete();
  }
}
