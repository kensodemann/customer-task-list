export function createApplicationServiceMock() {
  const mock = jasmine.createSpyObj('ApplicationService', ['registerForUpdates']);
  mock.showTabs = true;
  return mock;
}
