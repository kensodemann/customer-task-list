import { Subject } from 'rxjs';

export function createActivatedRouteMock() {
  return {
    snapshot: {
      paramMap: jasmine.createSpyObj('Snapshot', ['get'])
    }
  };
}

export function createNavControllerMock() {
  return jasmine.createSpyObj('NavController', [
    'goBack',
    'navigateForward',
    'navigateRoot'
  ]);
}

export function createOverlayElementMock(name: string) {
  return jasmine.createSpyObj(name, ['dismiss', 'present']);
}

export function createOverlayControllerMock(name: string, element?: any) {
  return jasmine.createSpyObj(name, {
    create: Promise.resolve(element),
    dismiss: undefined,
    getTop: Promise.resolve(element)
  });
}

export function createPlatformMock() {
  return jasmine.createSpyObj('Platform', {
    is: false,
    ready: Promise.resolve()
  });
}

export function createSQLiteMock() {
  return jasmine.createSpyObj('SQLite', {
    create: Promise.resolve()
  });
}

export function createSQLiteObjectMock() {
  return jasmine.createSpyObj('SQLiteObject', {
    transaction: Promise.resolve()
  });
}

export function createSQLiteTransactionMock() {
  return jasmine.createSpyObj('SQLiteTransaction', {
    executeSql: Promise.resolve()
  });
}

export function createStorageMock() {
  return jasmine.createSpyObj('Storage', {
    get: Promise.resolve(),
    ready: Promise.resolve(),
    remove: Promise.resolve(),
    set: Promise.resolve()
  });
}

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
