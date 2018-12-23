import { of } from 'rxjs';

export function createVersionServiceMock() {
  return jasmine.createSpyObj('VersionService', {
    get: of({
      version: '0.0.1',
      name: 'testy test',
      date: '2018-12-23'
    })
  });
}
