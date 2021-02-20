import { EMPTY } from 'rxjs';
import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export const createNotesServiceMock = () => {
  const mock = createFirestoreDataServiceMock();
  (mock as any).allFor = jest.fn(() => EMPTY);
  return mock;
};
