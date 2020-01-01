import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TaskEditorComponent } from '@app/editors';
import { TaskPage } from './task.page';
import { TasksService } from '@app/services/firestore-data';
import { Task } from '@app/models';

import { createActivatedRouteMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { createTasksServiceMock } from '@app/services/firestore-data/mocks';

describe('TaskPage', () => {
  let page: TaskPage;
  let fixture: ComponentFixture<TaskPage>;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [TaskPage],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(modal)
        },
        { provide: TasksService, useFactory: createTasksServiceMock }
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
    const route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('taskId');
  });

  it('get the task for the id', () => {
    const route = TestBed.get(ActivatedRoute);
    const tasks = TestBed.get(TasksService);
    route.snapshot.paramMap.get.mockReturnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.get).toHaveBeenCalledTimes(1);
    expect(tasks.get).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the project', () => {
    const route = TestBed.get(ActivatedRoute);
    const tasks = TestBed.get(TasksService);
    route.snapshot.paramMap.get.mockReturnValue('314159PI');
    tasks.get.mockReturnValue(
      of({
        id: '314159PI',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: new firestore.Timestamp(1432430034, 0),
        type: TaskTypes.Task,
        status: Statuses.Open,
        priority: Priorities.Normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us'
      })
    );
    fixture.detectChanges();
    expect(page.task).toEqual({
      id: '314159PI',
      name: 'Bang the Big',
      description: 'Just like it sounds there captain',
      enteredOn: new firestore.Timestamp(1432430034, 0),
      type: TaskTypes.Task,
      status: Statuses.Open,
      priority: Priorities.Normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us'
    });
  });

  describe('edit task', () => {
    const task: Task = {
      id: '314159PI',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: new firestore.Timestamp(14324053, 0),
      type: TaskTypes.Feature,
      status: Statuses.Closed,
      priority: Priorities.Normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us'
    };

    beforeEach(() => {
      const route = TestBed.get(ActivatedRoute);
      const tasks = TestBed.get(TasksService);
      route.snapshot.paramMap.get.mockReturnValue('314159PI');
      tasks.get.mockReturnValue(of(task));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.get(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component and passes the current task', () => {
      const modalController = TestBed.get(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
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
