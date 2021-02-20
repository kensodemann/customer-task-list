import { AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class FirestoreDataService<T extends { id?: string }> {
  get collection(): AngularFirestoreCollection<T> {
    return this.getCollection();
  }

  constructor() {}

  observeChanges(): Observable<Array<DocumentChangeAction<T>>> {
    return this.collection.stateChanges();
  }

  all(): Observable<Array<T>> {
    return this.collection.snapshotChanges().pipe(map(this.actionsToData));
  }

  async get(id: string): Promise<T> {
    const doc = await this.collection.doc<T>(id).ref.get();
    return { id, ...(doc && doc.data()) } as T;
  }

  add(item: T): Promise<DocumentReference> {
    return this.collection.add(item);
  }

  delete(item: T): Promise<void> {
    return this.collection.doc(item.id).delete();
  }

  update(item: T): Promise<void> {
    const data = { ...(item as Record<string, unknown>) } as T;
    delete data.id;
    return this.collection.doc(item.id).set(data);
  }

  protected actionsToData(actions: Array<DocumentChangeAction<T>>): Array<T> {
    return actions.map((a) => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...(data as Record<string, unknown>) } as T;
    });
  }

  protected abstract getCollection(): AngularFirestoreCollection<T>;
}
