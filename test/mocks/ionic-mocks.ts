export function createNavControllerMock() {
  return {
    goBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn()
  };
}

export function createOverlayElementMock() {
  return {
    dismiss: jest.fn(() => Promise.resolve()),
    onDidDismiss: jest.fn(() => Promise.resolve()),
    onWillDismiss: jest.fn(() => Promise.resolve()),
    present: jest.fn(() => Promise.resolve())
  };
}

export function createOverlayControllerMock(element?: any) {
  return {
    create: jest.fn(() => Promise.resolve(element)),
    dismiss: jest.fn(),
    getTop: jest.fn(() => Promise.resolve(element))
  };
}

export function createPlatformMock() {
  return {
    is: jest.fn(() => false),
    ready: jest.fn(() => Promise.resolve())
  };
}
