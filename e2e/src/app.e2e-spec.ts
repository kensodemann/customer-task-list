import { AboutPage } from './page-objects/pages/about.po';
import { AppPage } from './page-objects/pages/app.po';
import { CustomerEditor } from './page-objects/editors/customer-editor.po';
import { CustomerPage } from './page-objects/pages/customer.po';
import { CustomersPage } from './page-objects/pages/customers.po';
import { LoginPage } from './page-objects/pages/login.po';
import { MenuPage } from './page-objects/pages/menu.po';
import { NoteEditor } from './page-objects/editors/note-editor.po';
import { TasksPage } from './page-objects/pages/tasks.po';

import { registerCustomerTests } from './tests/customers';
import { registerLoginTests } from './tests/login';

const about = new AboutPage();
const app = new AppPage();
const customerEditor = new CustomerEditor();
const customer = new CustomerPage();
const customers = new CustomersPage();
const login = new LoginPage();
const menu = new MenuPage();
const noteEditor = new NoteEditor();
const tasks = new TasksPage();

registerLoginTests(about, app, customers, login, menu, tasks);
registerCustomerTests(customer, customers, customerEditor, noteEditor);
