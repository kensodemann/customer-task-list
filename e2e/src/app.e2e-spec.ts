import { AboutPage } from './page-objects/pages/about.po';
import { AppPage } from './page-objects/pages/app.po';
import { ProjectEditor } from './page-objects/editors/project-editor.po';
import { ProjectPage } from './page-objects/pages/project.po';
import { ProjectsPage } from './page-objects/pages/projects.po';
import { LoginPage } from './page-objects/pages/login.po';
import { MenuPage } from './page-objects/pages/menu.po';
import { NoteEditor } from './page-objects/editors/note-editor.po';
import { TasksPage } from './page-objects/pages/tasks.po';

import { registerProjectTests } from './tests/projects';
import { registerLoginTests } from './tests/login';

const about = new AboutPage();
const app = new AppPage();
const projectEditor = new ProjectEditor();
const project = new ProjectPage();
const projects = new ProjectsPage();
const login = new LoginPage();
const menu = new MenuPage();
const noteEditor = new NoteEditor();
const tasks = new TasksPage();

registerLoginTests(about, app, projects, login, menu, tasks);
registerProjectTests(project, projects, projectEditor, noteEditor);
