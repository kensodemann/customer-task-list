import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { Priorities, Statuses, TaskTypes } from '../default-data';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';
import { TaskPage } from './task.page';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

import {
  createActivatedRouteMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';
import { createTasksServiceMock } from '../services/tasks/tasks.mock';

describe('TaskPage', () => {
  let page: TaskPage;
  let fixture: ComponentFixture<TaskPage>;
  let modal;
  let modalController;
  let route;
  let tasks;

  beforeEach(async(() => {
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    route = createActivatedRouteMock();
    tasks = createTasksServiceMock();
    TestBed.configureTestingModule({
      declarations: [TaskPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: ModalController, useValue: modalController },
        { provide: TasksService, useValue: tasks }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPage);
    page = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(page).toBeTruthy();
  });

  it('gets the ID from the route', () => {
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('get the task for the id', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.get).toHaveBeenCalledTimes(1);
    expect(tasks.get).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the customer', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    tasks.get.and.returnValue(
      of({
        id: '314159PI',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      })
    );
    fixture.detectChanges();
    expect(page.task).toEqual({
      id: '314159PI',
      name: 'Bang the Big',
      description: 'Just like it sounds there captain',
      enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
      type: TaskTypes.Meeting,
      status: Statuses.Open,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    });
  });

  describe('edit task', () => {
    const task: TaskWithId = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      type: TaskTypes.FollowUp,
      status: Statuses.Closed,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('314159PI');
      tasks.get.and.returnValue(of(task));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component and passes the current task', () => {
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent,
        componentProps: { task: task }
      });
    });

    it('presents the modal', async () => {
      await page.edit();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
