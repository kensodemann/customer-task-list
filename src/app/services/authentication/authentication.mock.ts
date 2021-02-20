export const createAuthenticationServiceMock = () => ({
  login: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve()),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
});
