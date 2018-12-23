export function createAuthenticationServiceMock() {
  return jasmine.createSpyObj('AuthenticationService', {
    login: Promise.resolve(),
    logout: Promise.resolve()
  });
}
