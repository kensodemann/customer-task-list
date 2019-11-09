import { EMPTY } from 'rxjs';

export function createProjectsServiceMock() {
  return {
    all: jest.fn(() => EMPTY),
    get: jest.fn(() => EMPTY),
    add: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve())
  };
}
