import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

import { ProjectsService } from './projects.service';
import {
  createAction,
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock
} from 'test/mocks';

describe('ProjectsService', () => {
  let collection;
  let projects: ProjectsService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }]
    });
  });

  beforeEach(inject([ProjectsService], (service: ProjectsService) => {
    projects = service;
  }));

  it('should be created', () => {
    expect(projects).toBeTruthy();
  });

  it('grabs a references to the tasks collection', () => {
    const angularFirestore = TestBed.get(AngularFirestore);
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('projects');
  });

  describe('all', () => {
    it('looks for snapshot changes', () => {
      projects.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.and.returnValue(
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
      projects.all().subscribe(d =>
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
      projects.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the value of the document', () => {
      projects.get('199405fkkgi59');
      expect(document.valueChanges).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', () => {
      document.valueChanges.and.returnValue(
        of({
          name: 'Joe',
          description: 'Some guy named Joe who sells week on my street corner',
          isActive: false
        })
      );
      projects.get('199405fkkgi59').subscribe(c =>
        expect(c).toEqual({
          id: '199405fkkgi59',
          name: 'Joe',
          description: 'Some guy named Joe who sells week on my street corner',
          isActive: false
        })
      );
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      projects.add({
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
      collection.doc.and.returnValue(document);
    });

    it('gets a reference to the document', () => {
      projects.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('sets the document data', () => {
      projects.update({
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