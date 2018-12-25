import { empty } from 'rxjs';

export function createCustomersServiceMock() {
  return jasmine.createSpyObj('CustomersService', {
    all: empty()
  });
}
