import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

import { CustomersService } from './customers.service';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock
} from '../../../../test/mocks';
import { firestore } from 'firebase';

describe('CustomersService', () => {
  let angularFirestore;
  let collection;
  let customers: CustomersService;

  beforeEach(() => {
    angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }]
    });
  });

  beforeEach(inject([CustomersService], (service: CustomersService) => {
    customers = service;
  }));

  it('should be created', () => {
    expect(customers).toBeTruthy();
  });

  it('grabs a references to the tasks collection', () => {
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('customers');
  });

  describe('all', () => {
    it('looks for snapshot changes', () => {
      customers.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
        of([
          createAction('314PI', {
            name: `Baker's Square`,
            description:
              'Makers of overly sweet pies and otherwise crappy food',
            isActive: true
          }),
          createAction('420HI', {
            name: 'Joe',
            description:
              'Some guy named Joe who sells week on my street corner',
            isActive: false
          })
        ])
      );
      customers.all().subscribe(d =>
        expect(d).toEqual([
          {
            id: '314PI',
            name: `Baker's Square`,
            description:
              'Makers of overly sweet pies and otherwise crappy food',
            isActive: true
          },
          {
            id: '420HI',
            name: 'Joe',
            description:
              'Some guy named Joe who sells week on my street corner',
            isActive: false
          }
        ])
      );
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      customers.add({
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

  describe('update', () => {
    let document;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      angularFirestore.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      customers.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true
      });
      expect(angularFirestore.doc).toHaveBeenCalledTimes(1);
      expect(angularFirestore.doc).toHaveBeenCalledWith('customers/49950399KT');
    });

    it('sets the document data', () => {
      customers.update({
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
