import { EMPTY } from 'rxjs';

export function createTasksServiceMock() {
  return jasmine.createSpyObj('TasksService', {
    all: EMPTY,
    add: Promise.resolve(),
    delete: Promise.resolve()
  });
}
