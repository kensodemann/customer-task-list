import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { firestore } from 'firebase/app';

import { Priorities, Statuses, TaskTypes } from '../../../default-data';
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
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: TaskTypes.Meeting,
            status: Statuses.Open,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
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
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: TaskTypes.Meeting,
            status: Statuses.Open,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          }
        ])
      );
    });
  });

  describe('for customer', () => {
    beforeEach(() => {
      angularFirestore.collection.calls.reset();
    });

    it('grabs a references to the tasks collection', () => {
      tasks.forCustomer('451BK');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    });

    it('looks for snapshot changes', () => {
      tasks.forCustomer('451BK');
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
        of([
          createAction('42DA', {
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: TaskTypes.Meeting,
            status: Statuses.Open,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          })
        ])
      );
      tasks.forCustomer('451BK').subscribe(d =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            type: TaskTypes.Meeting,
            status: Statuses.Open,
            priority: Priorities.Normal,
            customerId: '451BK',
            customerName: 'Book Burners R Us'
          }
        ])
      );
    });
  });

  describe('get', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.and.returnValue(document);
    });

    it('gets a references to the document', () => {
      tasks.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the value of the document', () => {
      tasks.get('199405fkkgi59');
      expect(document.valueChanges).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', () => {
      document.valueChanges.and.returnValue(
        of({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
        })
      );
      tasks.get('199405fkkgi59').subscribe(c => expect(c).toEqual({
        id: '199405fkkgi59',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      }));
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      tasks.add({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      });
    });
  });

  describe('update', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.Repeating,
        priority: Priorities.Low,
        type: TaskTypes.Meeting,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        customerId: '73SC',
        customerName: 'Wheels',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('88395AA930FE');
    });

    it('sets the document data', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.Repeating,
        priority: Priorities.Low,
        type: TaskTypes.Meeting,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        customerId: '73SC',
        customerName: 'Wheels',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.Repeating,
        priority: Priorities.Low,
        type: TaskTypes.Meeting,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        customerId: '73SC',
        customerName: 'Wheels',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
    });
  });

  describe('delete', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
