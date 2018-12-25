import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { TasksPage } from './tasks.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { TasksService } from '../services/tasks/tasks.service';
import { createTasksServiceMock } from '../services/tasks/tasks.mock';
import { TaskWithId } from '../models/task';

describe('TasksPage', () => {
  let authentication;
  let tasks;
  let taskList: Subject<Array<TaskWithId>>;
  let page: TasksPage;
  let fixture: ComponentFixture<TasksPage>;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    tasks = createTasksServiceMock();
    taskList = new Subject();
    tasks.all.and.returnValue(taskList);
    TestBed.configureTestingModule({
      declarations: [TasksPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: TasksService, useValue: tasks }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  it('sets up an observable on the tasks', () => {
    expect(tasks.all).toHaveBeenCalledTimes(1);
  });

  it('changes the task list', () => {
    const list = [
      {
        id: '42DA',
        name: 'Find the answer',
        description: 'First find Deep Thought, then get the answer from it',
        enteredOn: { nanoseconds: 0, seconds: 14324053 },
        type: 'One Time',
        status: 'Closed'
      },
      {
        id: '73SC',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: 'Repeating',
        status: 'Open'
      }
    ];
    taskList.next(list);
    expect(page.allTasks).toEqual(list);
  });
});
