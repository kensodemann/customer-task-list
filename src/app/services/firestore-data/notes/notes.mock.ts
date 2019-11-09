import { EMPTY } from 'rxjs';

export function createNotesServiceMock() {
  return {
    allFor: jest.fn(() => EMPTY),
    get: jest.fn(() => EMPTY),
    add: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve())
  };
}
