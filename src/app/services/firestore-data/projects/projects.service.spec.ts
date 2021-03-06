import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  createAction,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createDocumentSnapshotMock,
} from '@test/mocks';
import { of } from 'rxjs';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let collection: any;
  let projects: ProjectsService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }],
    });
  });

  beforeEach(inject([ProjectsService], (service: ProjectsService) => {
    projects = service;
  }));

  it('should be created', () => {
    expect(projects).toBeTruthy();
  });

  describe('all', () => {
    it('looks for snapshot changes', () => {
      projects.all();
      expect(collection.snapshotChanges).toHaveBeenCalledTimes(1);
    });

    it('maps the changes', () => {
      collection.snapshotChanges.mockReturnValue(
        of([
          createAction('314PI', {
            name: `Baker's Square`,
            description:
              'Makers of overly sweet pies and otherwise crappy food',
            isActive: true,
          }),
          createAction('420HI', {
            name: 'Joe',
            description:
              'Some guy named Joe who sells week on my street corner',
            isActive: false,
          }),
        ]),
      );
      projects.all().subscribe(d =>
        expect(d).toEqual([
          {
            id: '314PI',
            name: `Baker's Square`,
            description:
              'Makers of overly sweet pies and otherwise crappy food',
            isActive: true,
          },
          {
            id: '420HI',
            name: 'Joe',
            description:
              'Some guy named Joe who sells week on my street corner',
            isActive: false,
          },
        ]),
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
      projects.get('199405fkkgi59');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('199405fkkgi59');
    });

    it('gets the document', () => {
      projects.get('199405fkkgi59');
      expect(document.ref.get).toHaveBeenCalledTimes(1);
    });

    it('returns the document with the ID', async () => {
      const snapshot = createDocumentSnapshotMock();
      document.ref.get.mockResolvedValue(snapshot);
      snapshot.data.mockReturnValue({
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false,
      });
      const p = await projects.get('199405fkkgi59');
      expect(p).toEqual({
        id: '199405fkkgi59',
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: false,
      });
    });
  });

  describe('add', () => {
    it('adds the item to the collection', () => {
      projects.add({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true,
      });
      expect(collection.add).toHaveBeenCalledTimes(1);
      expect(collection.add).toHaveBeenCalledWith({
        name: 'Fred Flintstone',
        description: 'Head of a modnern stone-age family',
        isActive: true,
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
      projects.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('sets the document data', () => {
      projects.update({
        id: '49950399KT',
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
      expect(document.set).toHaveBeenCalledTimes(1);
      expect(document.set).toHaveBeenCalledWith({
        name: 'Kyle',
        description: 'some kid in South Park',
        isActive: true,
      });
    });
  });
});
