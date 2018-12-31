import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { firestore } from 'firebase/app';

import { TasksService } from './tasks.service';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock
} from 'test/mocks';

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
            status: 'Closed',
            priority: 'Normal',
            customer: {
              id: '451BK',
              name: 'Book Burners R Us'
            }
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: 'Repeating',
            status: 'Open',
            priority: 'Normal',
            customer: {
              id: '451BK',
              name: 'Book Burners R Us'
            }
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
            status: 'Closed',
            priority: 'Normal',
            customer: {
              id: '451BK',
              name: 'Book Burners R Us'
            }
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: 'Repeating',
            status: 'Open',
            priority: 'Normal',
            customer: {
              id: '451BK',
              name: 'Book Burners R Us'
            }
          }
        ])
      );
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      tasks.add({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: 'Repeating',
        status: 'Open',
        priority: 'Normal',
        customer: {
          id: '451BK',
          name: 'Book Burners R Us'
        }
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: 'Repeating',
        status: 'Open',
        priority: 'Normal',
        customer: {
          id: '451BK',
          name: 'Book Burners R Us'
        }
      });
    });
  });

  describe('update', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      angularFirestore.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: 'Repeating',
        priority: 'Low',
        type: 'Meeting',
        dueDate: '2019-01-15',
        customer: {
          id: '73SC',
          name: 'Wheels'
        },
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(angularFirestore.doc).toHaveBeenCalledTimes(1);
      expect(angularFirestore.doc).toHaveBeenCalledWith('tasks/88395AA930FE');
    });

    it('sets the document data', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: 'Repeating',
        priority: 'Low',
        type: 'Meeting',
        dueDate: '2019-01-15',
        customer: {
          id: '73SC',
          name: 'Wheels'
        },
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: 'Repeating',
        priority: 'Low',
        type: 'Meeting',
        dueDate: '2019-01-15',
        customer: {
          id: '73SC',
          name: 'Wheels'
        },
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
    });
  });

  describe('delete', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      angularFirestore.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: 'Example',
        status: 'Open',
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        priority: 'Normal',
        customer: {
          id: '451BK',
          name: 'Book Burners R Us'
        }
      });
      expect(angularFirestore.doc).toHaveBeenCalledTimes(1);
      expect(angularFirestore.doc).toHaveBeenCalledWith('tasks/49950399KT');
    });

    it('deletes the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: 'Example',
        status: 'Open',
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        priority: 'Normal',
        customer: {
          id: '451BK',
          name: 'Book Burners R Us'
        }
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
