import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Customer, CustomerWithId } from '../../models/customer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private collection: AngularFirestoreCollection<Customer>;

  constructor(firestore: AngularFirestore) {
    this.collection = firestore.collection('customers');
  }

  all(): Observable<Array<CustomerWithId>> {
    return this.collection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
}
