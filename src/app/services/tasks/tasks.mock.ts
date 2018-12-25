import { empty } from 'rxjs';

export function createTasksServiceMock() {
  return jasmine.createSpyObj('TasksService', {
    all: empty()
  });
}
