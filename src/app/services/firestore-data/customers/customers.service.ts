import { Injectable } from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';

import { Customer } from '../../../models/customer';

import { FirestoreDataService } from '../firestore-data-service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends FirestoreDataService<Customer> {
  constructor(firestore: AngularFirestore) {
    super(firestore, 'customers');
  }
}
