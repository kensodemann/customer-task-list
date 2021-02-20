import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  createAction,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createDocumentSnapshotMock,
  fakeTimestamp,
} from '@test/mocks';
import { of } from 'rxjs';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let collection: any;
  let notes: NotesService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }],
    });
  });

  beforeEach(inject([NotesService], (service: NotesService) => {
    notes = service;
  }));

  it('should be created', () => {
    expect(notes).toBeTruthy();
  });

  describe('all for (project or task)', () => {
    beforeEach(() => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      (angularFirestore.collection as jest.Mock).mockClear();
    });

    it('grabs a references to the tasks collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      notes.allFor('451BK');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    });

    it('looks for snapshot changes', () => {
      notes.allFor('451BK');
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.mockReturnValue(
        of([
          createAction('42DA', {
            text: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            itemId: '451BK',
          }),
          createAction('73SC', {
            text: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430034),
            itemId: '451BK',
          }),
        ])
      );
      notes.allFor('451BK').subscribe((d) =>
        expect(d).toEqual([
          {
            id: '42DA',
            text: 'First find Deep Thought, then get the answer from it',
            enteredOn: fakeTimestamp(14324053),
            itemId: '451BK',
          },
          {
            id: '73SC',
            text: 'Just like it sounds there captain',
            enteredOn: fakeTimestamp(1432430034),
            itemId: '451BK',
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

    it('gets a references to the document', () => {
      notes.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the document', () => {
      notes.get('199405fkkgi59');
      expect(document.ref.get).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', async () => {
      const snapshot = createDocumentSnapshotMock();
      document.ref.get.mockResolvedValue(snapshot);
      snapshot.data.mockReturnValue({
        text: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430053),
        itemId: '451BK',
      });
      const n = await notes.get('199405fkkgi59');
      expect(n).toEqual({
        id: '199405fkkgi59',
        text: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430053),
        itemId: '451BK',
      });
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      notes.add({
        text: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432434053),
        itemId: '451BK',
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        text: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432434053),
        itemId: '451BK',
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
      notes.update({
        id: '88395AA930FE',
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
        enteredOn: fakeTimestamp(1545765815),
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('88395AA930FE');
    });

    it('sets the document data', () => {
      notes.update({
        id: '88395AA930FE',
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
        enteredOn: fakeTimestamp(1545765815),
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
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
      notes.delete({
        id: '49950399KT',
        text: 'Make them extra shiny',
        enteredOn: fakeTimestamp(0),
        itemId: '451BK',
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      notes.delete({
        id: '49950399KT',
        text: 'Make them extra shiny',
        enteredOn: fakeTimestamp(0),
        itemId: '451BK',
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
