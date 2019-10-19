import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { firestore } from 'firebase/app';

import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TasksService } from './tasks.service';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock
} from 'test/mocks';

describe('TasksService', () => {
  let collection;
  let tasks: TasksService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
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
    const angularFirestore = TestBed.get(AngularFirestore);
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
            enteredOn: new firestore.Timestamp(14324053, 0),
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: new firestore.Timestamp(1432430034, 0),
            type: TaskTypes.Task,
            status: Statuses.Open,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          })
        ])
      );
      tasks.all().subscribe(d =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: new firestore.Timestamp(14324053, 0),
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: new firestore.Timestamp(1432430034, 0),
            type: TaskTypes.Task,
            status: Statuses.Open,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          }
        ])
      );
    });
  });

  describe('for project', () => {
    beforeEach(() => {
      const angularFirestore = TestBed.get(AngularFirestore);
      angularFirestore.collection.calls.reset();
    });

    it('grabs a references to the tasks collection', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      tasks.forProject('451BK');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    });

    it('looks for snapshot changes', () => {
      tasks.forProject('451BK');
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
        of([
          createAction('42DA', {
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: new firestore.Timestamp(14324053, 0),
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: new firestore.Timestamp(1432430303, 0),
            type: TaskTypes.Task,
            status: Statuses.Open,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          })
        ])
      );
      tasks.forProject('451BK').subscribe(d =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: new firestore.Timestamp(14324053, 0),
            type: TaskTypes.Research,
            status: Statuses.Closed,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: new firestore.Timestamp(1432430303, 0),
            type: TaskTypes.Task,
            status: Statuses.Open,
            priority: Priorities.Normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us'
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
          enteredOn: new firestore.Timestamp(1424303405, 0),
          type: TaskTypes.Task,
          status: Statuses.Open,
          priority: Priorities.Normal,
          projectId: '451BK',
          projectName: 'Book Burners R Us'
        })
      );
      tasks.get('199405fkkgi59').subscribe(c =>
        expect(c).toEqual({
          id: '199405fkkgi59',
          name: 'Bang the Big',
          description: 'Just like it sounds there captain',
          enteredOn: new firestore.Timestamp(1424303405, 0),
          type: TaskTypes.Task,
          status: Statuses.Open,
          priority: Priorities.Normal,
          projectId: '451BK',
          projectName: 'Book Burners R Us'
        })
      );
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      tasks.add({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: new firestore.Timestamp(1432430034, 0),
        type: TaskTypes.Task,
        status: Statuses.Open,
        priority: Priorities.Normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us'
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: new firestore.Timestamp(1432430034, 0),
        type: TaskTypes.Task,
        status: Statuses.Open,
        priority: Priorities.Normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us'
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
        status: Statuses.Open,
        priority: Priorities.Low,
        type: TaskTypes.Task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
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
        status: Statuses.Open,
        priority: Priorities.Low,
        type: TaskTypes.Task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.Open,
        priority: Priorities.Low,
        type: TaskTypes.Task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
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
        type: TaskTypes.Research,
        status: Statuses.Open,
        enteredOn: new firestore.Timestamp(0, 0),
        priority: Priorities.Normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us'
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: TaskTypes.Research,
        status: Statuses.Open,
        enteredOn: new firestore.Timestamp(0, 0),
        priority: Priorities.Normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us'
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
