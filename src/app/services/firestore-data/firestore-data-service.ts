import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  DocumentReference
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FirestoreDataService<T extends object> {
  protected collection: AngularFirestoreCollection<T>;

  constructor(firestore: AngularFirestore, collectionName: string) {
    this.collection = firestore.collection(collectionName);
  }

  all(): Observable<Array<{ id: string } & T>> {
    return this.collection.snapshotChanges().pipe(map(this.actionsToData));
  }

  get(id: string): Observable<{ id: string } & T> {
    return this.collection
      .doc<T>(id)
      .valueChanges()
      .pipe(
        map(item => {
          return { id: id, ...(item as object) } as { id: string } & T;
        })
      );
  }

  add(item: T): Promise<DocumentReference> {
    return this.collection.add(item);
  }

  delete(item: { id: string } & T): Promise<void> {
    return this.collection.doc(item.id).delete();
  }

  update(item: { id: string } & T): Promise<void> {
    const data = { ...(item as object) } as { id: string } & T;
    delete data.id;
    return this.collection.doc(item.id).set(data);
  }

  protected actionsToData(
    actions: Array<DocumentChangeAction<T>>
  ): Array<{ id: string } & T> {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...(data as object) } as { id: string } & T;
    });
  }
}
