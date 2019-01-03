import { EMPTY } from 'rxjs';

export function createTasksServiceMock() {
  return jasmine.createSpyObj('TasksService', {
    all: EMPTY,
    forCustomer: EMPTY,
    add: Promise.resolve(),
    update: Promise.resolve(),
    delete: Promise.resolve()
  });
}
