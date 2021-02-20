import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import {
  createAction,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createDocumentSnapshotMock,
  fakeTimestamp,
} from '@test/mocks';
import { of } from 'rxjs';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let collection: any;
  let tasks: TasksService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }],
    });
  });

  beforeEach(inject([TasksService], (service: TasksService) => {
    tasks = service;
  }));

  it('should be created', () => {
    expect(tasks).toBeTruthy();
  });

  describe('all', () => {
    it('grabs a references to the tasks collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      tasks.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('tasks');
    });

    it('looks for snapshot changes', () => {
      tasks.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.mockReturnValue(
        of([
          createAction('42DA', {
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            type: TaskTypes.research,
            status: Statuses.closed,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430034),
            type: TaskTypes.task,
            status: Statuses.open,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          }),
        ])
      );
      tasks.all().subscribe((d) =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            type: TaskTypes.research,
            status: Statuses.closed,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430034),
            type: TaskTypes.task,
            status: Statuses.open,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          },
        ])
      );
    });
  });

  describe('for project', () => {
    beforeEach(() => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      (angularFirestore.collection as jest.Mock).mockClear();
    });

    it('grabs a references to the tasks collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      tasks.forProject('451BK');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    });

    it('looks for snapshot changes', () => {
      tasks.forProject('451BK');
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.mockReturnValue(
        of([
          createAction('42DA', {
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            type: TaskTypes.research,
            status: Statuses.closed,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          }),
          createAction('73SC', {
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430303),
            type: TaskTypes.task,
            status: Statuses.open,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          }),
        ])
      );
      tasks.forProject('451BK').subscribe((d) =>
        expect(d).toEqual([
          {
            id: '42DA',
            name: 'Find the answer',
            description: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            type: TaskTypes.research,
            status: Statuses.closed,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          },
          {
            id: '73SC',
            name: 'Bang the Big',
            description: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430303),
            type: TaskTypes.task,
            status: Statuses.open,
            priority: Priorities.normal,
            projectId: '451BK',
            projectName: 'Book Burners R Us',
          },
        ])
      );
    });
  });

  describe('get', () => {
    let document: any;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('grabs a references to the tasks collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      tasks.get('1994309500349');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('tasks');
    });

    it('gets a references to the document', async () => {
      await tasks.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the the document', async () => {
      await tasks.get('199405fkkgi59');
      expect(document.ref.get).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', async () => {
      const snapshot = createDocumentSnapshotMock();
      document.ref.get.mockResolvedValue(snapshot);
      snapshot.data.mockReturnValue({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1424303405),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
      const t = await tasks.get('199405fkkgi59');
      expect(t).toEqual({
        id: '199405fkkgi59',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1424303405),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      tasks.add({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430034),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430034),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
    });
  });

  describe('update', () => {
    let document: any;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.open,
        priority: Priorities.low,
        type: TaskTypes.task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
        enteredOn: fakeTimestamp(1545765815),
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('88395AA930FE');
    });

    it('sets the document data', () => {
      tasks.update({
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.open,
        priority: Priorities.low,
        type: TaskTypes.task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
        enteredOn: fakeTimestamp(1545765815),
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.open,
        priority: Priorities.low,
        type: TaskTypes.task,
        beginDate: '2019-01-15',
        endDate: '2019-01-17',
        projectId: '73SC',
        projectName: 'Wheels',
        enteredOn: fakeTimestamp(1545765815),
      });
    });
  });

  describe('delete', () => {
    let document: any;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: TaskTypes.research,
        status: Statuses.open,
        enteredOn: fakeTimestamp(0),
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      tasks.delete({
        id: '49950399KT',
        name: 'Scrub Pots',
        description: 'Make them extra shiny',
        type: TaskTypes.research,
        status: Statuses.open,
        enteredOn: fakeTimestamp(0),
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
