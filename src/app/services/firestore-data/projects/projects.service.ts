import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { Project } from '@app/models';

import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService extends FirestoreDataService<Project> {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<Project> {
    return this.firestore.collection('projects');
  }
}
