import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { of } from 'rxjs';

import { NotesService } from './notes.service';

import {
  createAction,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock
} from '../../../../../test/mocks';

describe('NotesService', () => {
  let angularFirestore;
  let collection;
  let notes: NotesService;

  beforeEach(() => {
    angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }]
    });
  });

  beforeEach(inject([NotesService], (service: NotesService) => {
    notes = service;
  }));

  it('should be created', () => {
    expect(notes).toBeTruthy();
  });

  it('grabs a references to the tasks collection', () => {
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('notes');
  });

  describe('all for (customer or task)', () => {
    beforeEach(() => {
      angularFirestore.collection.calls.reset();
    });

    it('grabs a references to the tasks collection', () => {
      notes.allFor('451BK');
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    });

    it('looks for snapshot changes', () => {
      notes.allFor('451BK');
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
        of([
          createAction('42DA', {
            text: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            itemId: '451BK'
          }),
          createAction('73SC', {
            text: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            itemId: '451BK'
          })
        ])
      );
      notes.allFor('451BK').subscribe(d =>
        expect(d).toEqual([
          {
            id: '42DA',
            text: 'First find Deep Thought, then get the answer from it',
            enteredOn: { nanoseconds: 0, seconds: 14324053 },
            itemId: '451BK'
          },
          {
            id: '73SC',
            text: 'Just like it sounds there captain',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
            itemId: '451BK'
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
      notes.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the value of the document', () => {
      notes.get('199405fkkgi59');
      expect(document.valueChanges).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', () => {
      document.valueChanges.and.returnValue(
        of({
          text: 'Just like it sounds there captain',
          enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
          itemId: '451BK'
        })
      );
      notes.get('199405fkkgi59').subscribe(c =>
        expect(c).toEqual({
          id: '199405fkkgi59',
          text: 'Just like it sounds there captain',
          enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
          itemId: '451BK'
        })
      );
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      notes.add({
        text: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        itemId: '451BK'
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        text: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        itemId: '451BK'
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
      notes.update({
        id: '88395AA930FE',
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('88395AA930FE');
    });

    it('sets the document data', () => {
      notes.update({
        id: '88395AA930FE',
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        text: 'Weekly status meeting, usually on Thursdays',
        itemId: '73SC',
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
      notes.delete({
        id: '49950399KT',
        text: 'Make them extra shiny',
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        itemId: '451BK'
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      notes.delete({
        id: '49950399KT',
        text: 'Make them extra shiny',
        enteredOn: {
          nanoseconds: 0,
          seconds: 0
        },
        itemId: '451BK'
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });
});
