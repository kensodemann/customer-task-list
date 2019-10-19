import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Project } from '@app/models';

import { FirestoreDataService } from '../firestore-data-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends FirestoreDataService<Project> {
  constructor(firestore: AngularFirestore) {
    super(firestore, 'projects');
  }
}
