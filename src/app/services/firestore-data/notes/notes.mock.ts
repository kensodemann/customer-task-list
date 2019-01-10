import { EMPTY } from 'rxjs';

export function createNotesServiceMock() {
  return jasmine.createSpyObj('NotesService', {
    allFor: EMPTY,
    get: EMPTY,
    add: Promise.resolve(),
    update: Promise.resolve(),
    delete: Promise.resolve()
  });
}
