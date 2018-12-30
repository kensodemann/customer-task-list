import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { TasksPage } from './tasks.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { createTasksServiceMock } from '../services/tasks/tasks.mock';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';

describe('TasksPage', () => {
  let alert;
  let alertController;
  let authentication;
  let fixture: ComponentFixture<TasksPage>;
  let page: TasksPage;
  let tasks;
  let taskList: Subject<Array<TaskWithId>>;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    authentication = createAuthenticationServiceMock();
    tasks = createTasksServiceMock();
    taskList = new Subject();
    tasks.all.and.returnValue(taskList);
    TestBed.configureTestingModule({
      declarations: [TasksPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useValue: alertController },
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

  describe('delete', () => {
    const task: TaskWithId = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      type: 'One Time',
      status: 'Closed'
    };

    it('creates an alert', () => {
      page.delete(task);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await page.delete(task);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      page.delete(task);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(tasks.delete).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      page.delete(task);
      const button = alertController.create.calls.argsFor(0)[0].buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });
});
