import { inject, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

import { FirestoreDataService } from './firestore-data.service';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFireAuthMock,
  createDocumentSnapshotMock
} from '@test/mocks';

interface DataType {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Injectable()
class TestService extends FirestoreDataService<DataType> {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<DataType> {
    return this.firestore.collection('data-collection');
  }
}

describe('FirestoreDataService', () => {
  let collection;
  let dataService: FirestoreDataService<DataType>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock },
        TestService
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(collection);
  });

  beforeEach(inject([TestService], (service: TestService) => {
    dataService = service;
    const afAuth = TestBed.get(AngularFireAuth);
    afAuth.authState.next();
  }));

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  describe('all', () => {
    it('grabs a references to the data collection', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      dataService.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('data-collection');
    });

    it('looks for snapshot changes', () => {
      dataService.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', done => {
      collection.snapshotChanges.mockReturnValue(
        of([
          createAction('314PI', {
            name: `Baker's Square`,
            description: 'Makers of overly sweet pies and otherwise crappy food',
            isActive: true
          }),
          createAction('420HI', {
            name: 'Joe',
            description: 'Some guy named Joe who sells week on my street corner',
            isActive: false
          })
        ])
      );
      dataService.all().subscribe(d => {
        expect(d).toEqual([
          {
            id: '314PI',
            name: `Baker's Square`,
            description: 'Makers of overly sweet pies and otherwise crappy food',
            isActive: true
          },
          {
            id: '420HI',
            name: 'Joe',
            description: 'Some guy named Joe who sells week on my street corner',
            isActive: false
          }
        ]);
        done();
      });
    });
  });

  describe('get', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a references to the document', () => {
      dataService.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the value of the document', () => {
      dataService.get('199405fkkgi59');
      expect(document.ref.get).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', async () => {
      const snapshot = createDocumentSnapshotMock();
      snapshot.data.mockReturnValue({
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false
      });
      document.ref.get.mockReturnValue(snapshot);
      expect(await dataService.get('199405fkkgi59')).toEqual({
        id: '199405fkkgi59',
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false
      });
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      dataService.add({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true
      });
    });
  });

  describe('delete', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', () => {
      dataService.delete({
        id: '49950399KT',
        name: 'shiny',
        description: 'Make them extra shiny',
        isActive: true
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('deletes the document', () => {
      dataService.delete({
        id: '49950399KT',
        name: 'shiny',
        description: 'Make them extra shiny',
        isActive: true
      });
      expect(document.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      collection.doc.mockReturnValue(document);
    });

    it('gets a reference to the document', () => {
      dataService.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('sets the document data', () => {
      dataService.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true
      });
    });
  });
});
