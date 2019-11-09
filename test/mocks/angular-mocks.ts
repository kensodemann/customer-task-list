import { EMPTY } from 'rxjs';

export function createActivatedRouteMock() {
  return {
    snapshot: {
      paramMap: { get: jest.fn() }
    }
  };
}

export function createSwUpdateMock() {
  return {
    activateUpdate: jest.fn(() => Promise.resolve()),
    available: EMPTY
  };
}
