import { EMPTY } from 'rxjs';

export function createTasksServiceMock() {
  return {
    all: jest.fn(() => EMPTY),
    forProject: jest.fn(() => EMPTY),
    get: jest.fn(() => EMPTY),
    add: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve())
  };
}
