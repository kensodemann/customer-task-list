import { PageObjectBase } from './base.po';

export class TasksPage  extends PageObjectBase{
  constructor() {
    super('app-tasks', '/tabs/tasks');
  }
}
