import { EMPTY, of, Subject } from 'rxjs';

export const createAngularFireAuthMock = () => ({
  authState: new Subject(),
  user: of(null),
  idToken: of(null),
  idTokenResult: of(null),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signInWithPopup: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
});

export const fakeTimestamp = (seconds: number): any => ({ seconds, nanoseconds: 0 });

class TestDocument<T> {
  private lclData: T;

  constructor(public id: string, data: T) {
    this.lclData = data;
  }

  data(): T {
    return this.lclData;
  }
}

export function createAction<T>(id: string, data: T) {
  return {
    payload: {
      doc: new TestDocument(id, data),
    },
  };
}

export const createAngularFirestoreDocumentMock = () => ({
  set: jest.fn(() => Promise.resolve()),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  valueChanges: jest.fn(() => EMPTY),
  snapshotChanges: jest.fn(() => EMPTY),
  collection: jest.fn(),
  ref: createDocumentReferenceMock(),
});

export const createAngularFirestoreCollectionMock = () => ({
  doc: jest.fn(() => createAngularFirestoreDocumentMock()),
  add: jest.fn(() => Promise.resolve(createDocumentReferenceMock())),
  valueChanges: jest.fn(() => EMPTY),
  snapshotChanges: jest.fn(() => EMPTY),
  stateChanges: jest.fn(() => EMPTY),
  ref: createCollectionReferenceMock([]),
});

export const createAngularFirestoreMock = () => ({
  collection: jest.fn(() => createAngularFirestoreCollectionMock()),
  doc: jest.fn(() => createAngularFirestoreDocumentMock()),
});

export const createCollectionReferenceMock = (docs: Array<any>) => ({
  where: jest.fn(() => ({
    get: jest.fn(() =>
      Promise.resolve({
        size: docs.length,
        docs,
      })
    ),
  })),
});

export const createDocumentReferenceMock = (doc?: { id: string; data: any }) => ({
  get: jest.fn(() => Promise.resolve(createDocumentSnapshotMock(doc))),
});

export const createDocumentSnapshotMock = (doc?: { id: string; data: any }) => ({
  id: doc ? doc.id : 0,
  data: jest.fn(() => (doc ? doc.data : {})),
});
