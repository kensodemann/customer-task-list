export function createApplicationServiceMock() {
  return {
    registerForUpdates: jest.fn(),
    showTabs: true,
  };
}
