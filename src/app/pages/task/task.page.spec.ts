import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TaskEditorComponent } from '@app/editors';
import { Task } from '@app/models';
import { TasksService } from '@app/services/firestore-data';
import { createTasksServiceMock } from '@app/services/firestore-data/mocks';
import { logout } from '@app/store/actions/auth.actions';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createActivatedRouteMock,
  createOverlayControllerMock,
  createOverlayElementMock,
  fakeTimestamp,
} from '@test/mocks';
import { TaskPage } from './task.page';

describe('TaskPage', () => {
  let page: TaskPage;
  let fixture: ComponentFixture<TaskPage>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [TaskPage],
        providers: [
          { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
          { provide: TasksService, useFactory: createTasksServiceMock },
          provideMockStore(),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPage);
    page = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(page).toBeTruthy();
  });

  it('gets the ID from the route', () => {
    const route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('taskId');
  });

  it('get the task for the id', () => {
    const route = TestBed.inject(ActivatedRoute);
    const tasks = TestBed.inject(TasksService);
    (route.snapshot.paramMap.get as jest.Mock).mockReturnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.get).toHaveBeenCalledTimes(1);
    expect(tasks.get).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the project', async () => {
    const route = TestBed.inject(ActivatedRoute);
    const tasks = TestBed.inject(TasksService);
    (route.snapshot.paramMap.get as jest.Mock).mockReturnValue('314159PI');
    (tasks.get as jest.Mock).mockResolvedValue({
      id: '314159PI',
      name: 'Bang the Big',
      description: 'Just like it sounds there captain',
      enteredOn: fakeTimestamp(1432430034),
      type: TaskTypes.task,
      status: Statuses.open,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    });
    await page.ngOnInit();
    expect(page.task).toEqual({
      id: '314159PI',
      name: 'Bang the Big',
      description: 'Just like it sounds there captain',
      enteredOn: fakeTimestamp(1432430034),
      type: TaskTypes.task,
      status: Statuses.open,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    });
  });

  describe('edit task', () => {
    const task: Task = {
      id: '314159PI',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: fakeTimestamp(14324053),
      type: TaskTypes.feature,
      status: Statuses.closed,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    };

    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      const tasks = TestBed.inject(TasksService);
      (route.snapshot.paramMap.get as jest.Mock).mockReturnValue('314159PI');
      (tasks.get as jest.Mock).mockResolvedValue(task);
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component and passes the current task', () => {
      const modalController = TestBed.inject(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: TaskEditorComponent,
        componentProps: { task },
      });
    });

    it('presents the modal', async () => {
      await page.edit();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      page.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
