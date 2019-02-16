import { AboutPage } from './page-objects/pages/about.po';
import { AppPage } from './page-objects/pages/app.po';
import { CustomersPage } from './page-objects/pages/customers.po';
import { LoginPage } from './page-objects/pages/login.po';
import { MenuPage } from './page-objects/pages/menu.po';
import { TasksPage } from './page-objects/pages/tasks.po';

describe('Login', () => {
  let about: AboutPage;
  let app: AppPage;
  let customers: CustomersPage;
  let login: LoginPage;
  let menu: MenuPage;
  let tasks: TasksPage;

  beforeEach(() => {
    about = new AboutPage();
    app = new AppPage();
    customers = new CustomersPage();
    login = new LoginPage();
    menu = new MenuPage();
    tasks = new TasksPage();
    app.load();
  });

  describe('when logged out', () => {
    it('displays the login screen', () => {
      expect(login.rootElement().isDisplayed()).toEqual(true);
    });

    it('allows in-app navigation to about', () => {
      menu.clickAbout();
      about.waitUntilVisible();
      login.waitUntilInvisible();
    });

    it('does not allow in-app navigation to tasks', () => {
      menu.clickTasks();
      app.waitForPageNavigation();
      expect(login.rootElement().isDisplayed()).toEqual(true);
    });

    it('does not allow in-app navigation to customers', () => {
      menu.clickCustomers();
      app.waitForPageNavigation();
      expect(login.rootElement().isDisplayed()).toEqual(true);
    });

    it('displays an error message if the login fails', () => {
      login.enterEMail('test@test.com');
      login.enterPassword('bogus');
      login.clickSignIn();
      login.waitForError();
      expect(login.getErrorMessage()).toEqual(
        'The password is invalid or the user does not have a password.'
      );
    });

    it('navigates to the tasks page if the login succeeds', () => {
      login.enterEMail('test@test.com');
      login.enterPassword('testtest');
      login.clickSignIn();
      tasks.waitUntilVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      tasks.waitUntilVisible();
    });

    it('allows navigation to the customers page', () => {
      menu.clickCustomers();
      customers.waitUntilVisible();
      tasks.waitUntilInvisible();
    });

    it('allows navigation to the about page', () => {
      menu.clickAbout();
      about.waitUntilVisible();
      tasks.waitUntilInvisible();
    });

    it('allows navigation back to the tasks page', () => {
      menu.clickAbout();
      tasks.waitUntilInvisible();
      menu.clickTasks();
      tasks.waitUntilVisible();
    });
  });

  it('logs out', () => {
    menu.clickAbout();
    about.waitUntilVisible();
    about.clickLogout();
  });
});