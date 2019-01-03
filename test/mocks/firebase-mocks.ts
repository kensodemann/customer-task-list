import { EMPTY, Subject } from 'rxjs';

export function createAngularFireAuthMock() {
  return {
    authState: new Subject(),
    auth: jasmine.createSpyObj('Auth', {
      signInWithEmailAndPassword: Promise.resolve(),
      signInWithPopup: Promise.resolve(),
      signOut: Promise.resolve()
    })
  };
}

class TestDocument<T> {
  private _data: T;

  constructor(public id: string, data: T) {
    this._data = data;
  }

  data(): T {
    return this._data;
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
  return jasmine.createSpyObj('AngularFirestoreDocument', {
    set: Promise.resolve(),
    update: Promise.resolve(),
    delete: Promise.resolve(),
    valueChanges: EMPTY,
    snapshotChanges: EMPTY
  });
}

export function createAngularFirestoreCollectionMock() {
  return jasmine.createSpyObj('AngularFirestoreCollection', {
    doc: createAngularFirestoreDocumentMock(),
    add: Promise.resolve(),
    valueChanges: EMPTY,
    snapshotChanges: EMPTY
  });
}

export function createAngularFirestoreMock() {
  return jasmine.createSpyObj('AngularFirestore', {
    collection: createAngularFirestoreCollectionMock(),
    doc: createAngularFirestoreDocumentMock()
  });
}
