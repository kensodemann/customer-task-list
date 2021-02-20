import { AppPage } from '../page-objects/pages/app.po';
import { AboutPage } from '../page-objects/pages/about.po';
import { ProjectsPage } from '../page-objects/pages/projects.po';
import { LoginPage } from '../page-objects/pages/login.po';
import { MenuPage } from '../page-objects/pages/menu.po';
import { TasksPage } from '../page-objects/pages/tasks.po';

export const registerLoginTests = (
  about: AboutPage,
  app: AppPage,
  projects: ProjectsPage,
  login: LoginPage,
  menu: MenuPage,
  tasks: TasksPage
) => {
  describe('Login', () => {
    beforeEach(() => {
      app.load();
    });

    describe('before logged in', () => {
      it('displays the login screen', () => {
        login.waitUntilVisible();
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

      it('does not allow in-app navigation to projects', () => {
        menu.clickProjects();
        app.waitForPageNavigation();
        expect(login.rootElement().isDisplayed()).toEqual(true);
      });

      it('displays an error message if the login fails', () => {
        login.enterEMail('test@test.com');
        login.enterPassword('bogus');
        login.clickSignIn();
        login.waitForError();
        expect(login.getErrorMessage()).toEqual('The password is invalid or the user does not have a password.');
      });

      it('navigates to the tasks page if the login succeeds', () => {
        login.enterEMail('test@test.com');
        login.enterPassword('testtest');
        login.clickSignIn();
        tasks.waitUntilVisible();
      });
    });

    describe('once logged in', () => {
      beforeEach(() => {
        tasks.waitUntilVisible();
      });

      it('allows navigation to the projects page', () => {
        menu.clickProjects();
        projects.waitUntilVisible();
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
  });
};
