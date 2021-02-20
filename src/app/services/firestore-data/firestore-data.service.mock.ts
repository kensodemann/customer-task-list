import { EMPTY } from 'rxjs';

export const createFirestoreDataServiceMock = () => ({
  observeChanges: jest.fn(() => EMPTY),
  all: jest.fn(() => EMPTY),
  get: jest.fn(() => Promise.resolve()),
  add: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  update: jest.fn(() => Promise.resolve()),
});
