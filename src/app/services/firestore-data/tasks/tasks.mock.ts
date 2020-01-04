import { EMPTY } from 'rxjs';
import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createTasksServiceMock() {
  const mock = createFirestoreDataServiceMock();
  (mock as any).forProject = jest.fn(() => EMPTY);
  return mock;
}
