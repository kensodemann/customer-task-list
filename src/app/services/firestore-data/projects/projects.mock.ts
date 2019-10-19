import { EMPTY } from 'rxjs';

export function createProjectsServiceMock() {
  return jasmine.createSpyObj('ProjectsService', {
    all: EMPTY,
    get: EMPTY,
    add: Promise.resolve(),
    update: Promise.resolve()
  });
}
