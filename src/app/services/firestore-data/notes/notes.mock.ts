import { EMPTY } from 'rxjs';
import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createNotesServiceMock() {
  const mock = createFirestoreDataServiceMock();
  (mock as any).allFor = jest.fn(() => EMPTY);
  return mock;
}
