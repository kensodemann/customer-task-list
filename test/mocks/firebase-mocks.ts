import { EMPTY, of, Subject } from 'rxjs';

export function createAngularFireAuthMock() {
  return {
    authState: new Subject(),
    user: of(null),
    idToken: of(null),
    idTokenResult: of(null),
    auth: {
      sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
      signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
      signInWithPopup: jest.fn(() => Promise.resolve()),
      signOut: jest.fn(() => Promise.resolve())
    }
  };
}

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
      doc: new TestDocument(id, data)
    }
  };
}

export function createAngularFirestoreDocumentMock() {
  return {
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    valueChanges: jest.fn(() => EMPTY),
    snapshotChanges: jest.fn(() => EMPTY),
    collection: jest.fn(),
    ref: createDocumentReferenceMock()
  };
}

export function createAngularFirestoreCollectionMock() {
  return {
    doc: jest.fn(() => createAngularFirestoreDocumentMock()),
    add: jest.fn(() => Promise.resolve(createDocumentReferenceMock())),
    valueChanges: jest.fn(() => EMPTY),
    snapshotChanges: jest.fn(() => EMPTY),
    ref: createCollectionReferenceMock([])
  };
}

export function createAngularFirestoreMock() {
  return {
    collection: jest.fn(() => createAngularFirestoreCollectionMock()),
    doc: jest.fn(() => createAngularFirestoreDocumentMock())
  };
}

export function createCollectionReferenceMock(docs: Array<any>) {
  return {
    where: jest.fn(() => ({
      get: jest.fn(() =>
        Promise.resolve({
          size: docs.length,
          docs
        })
      )
    }))
  };
}

export function createDocumentReferenceMock(doc?: { id: string; data: any }) {
  return {
    get: jest.fn(() => Promise.resolve(createDocumentSnapshotMock(doc)))
  };
}

export function createDocumentSnapshotMock(doc?: { id: string; data: any }) {
  return {
    id: doc ? doc.id : 0,
    data: jest.fn(() => (doc ? doc.data : {}))
  };
}
