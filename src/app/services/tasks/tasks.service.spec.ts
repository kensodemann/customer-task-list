import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

import { TasksService } from './tasks.service';
import { Task } from '../../models/task';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock
} from '../../../../test/mocks';

describe('TasksService', () => {
  let angularFirestore;
  let collection;
  let tasks: TasksService;

  beforeEach(() => {
    angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }]
    });
  });

  beforeEach(inject([TasksService], (service: TasksService) => {
    tasks = service;
  }));

  it('should be created', () => {
    expect(tasks).toBeTruthy();
  });

  it('grabs a references to the tasks collection', () => {
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('tasks');
  });

  describe('all', () => {
    it('looks for snapshot changes', () => {
      tasks.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
        of([
          createAction('42DA', {
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            type: 'One Time',
            status: 'Closed'
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: 'Repeating',
            status: 'Open'
          })
        ])
      );
      tasks.all().subscribe(d =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            type: 'One Time',
            status: 'Closed'
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: 'Repeating',
            status: 'Open'
          }
        ])
      );
    });
  });
});
