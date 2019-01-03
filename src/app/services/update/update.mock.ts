export function createUpdateServiceMock() {
  return jasmine.createSpyObj('UpdateService', ['register']);
}
