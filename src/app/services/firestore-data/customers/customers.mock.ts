import { EMPTY} from 'rxjs';

export function createCustomersServiceMock() {
  return jasmine.createSpyObj('CustomersService', {
    all: EMPTY,
    get: EMPTY,
    add: Promise.resolve(),
    update: Promise.resolve()
  });
}