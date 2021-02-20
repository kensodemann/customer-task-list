import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { ProjectEditorComponent } from '@app/editors';
import { Task } from '@app/models/task';
import { TasksService } from '@app/services/firestore-data';
import { createTasksServiceMock } from '@app/services/firestore-data/mocks';
import { logout } from '@app/store/actions/auth.actions';
import { ProjectState } from '@app/store/reducers/project/project.reducer';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initializeTestProjects, testProjectIds, testProjects } from '@test/data';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock,
  fakeTimestamp,
} from '@test/mocks';
import { of } from 'rxjs';
import { ProjectPage } from './project.page';

describe('ProjectPage', () => {
  let page: ProjectPage;
  let fixture: ComponentFixture<ProjectPage>;
  let modal: any;
  let testTasks: Array<Task>;

  beforeEach(
    waitForAsync(() => {
      initializeTestProjects();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [ProjectPage],
        providers: [
          { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
          { provide: NavController, useFactory: createNavControllerMock },
          { provide: TasksService, useFactory: createTasksServiceMock },
          provideMockStore<{ projects: ProjectState }>({
            initialState: { projects: { loading: false, ids: testProjectIds, entities: testProjects } },
          }),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    const tasks = TestBed.inject(TasksService);
    initializeTestTasks();
    (tasks.forProject as any).mockReturnValue(of(testTasks));
    fixture = TestBed.createComponent(ProjectPage);
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
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('projectId');
  });

  it('gets the project from the store', async () => {
    const id = testProjectIds[2];
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap as any).get.mockReturnValue(id);
    await page.ngOnInit();
    expect(page.project).toEqual(testProjects[id]);
  });

  it('gets the tasks for the project', () => {
    const route = TestBed.inject(ActivatedRoute);
    const tasks = TestBed.inject(TasksService);
    (route.snapshot.paramMap as any).get.mockReturnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.forProject).toHaveBeenCalledTimes(1);
    expect(tasks.forProject).toHaveBeenCalledWith('314159PI');
  });

  describe('edit project', () => {
    let id: string;
    beforeEach(() => {
      id = testProjectIds[3];
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap as any).get.mockReturnValue(id);
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component and passes the project', () => {
      const modalController = TestBed.inject(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: ProjectEditorComponent,
        componentProps: { project: testProjects[id] },
      });
    });

    it('presents the modal', async () => {
      await page.edit();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('taskCount', () => {
    it('returns zero before init completes', () => {
      expect(page.taskCount()).toEqual(0);
    });

    describe('after initialization is complete', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('counts all tasks', () => {
        expect(page.taskCount()).toEqual(testTasks.length);
      });

      it('counts the open tasks', () => {
        expect(page.taskCount(Statuses.open)).toEqual(3);
      });

      it('counts the on hold tasks', () => {
        expect(page.taskCount(Statuses.onHold)).toEqual(3);
      });

      it('counts the closed tasks', () => {
        expect(page.taskCount(Statuses.closed)).toEqual(2);
      });

      it('returns zero if the status is not valid', () => {
        expect(page.taskCount('SomeInvalidStatus')).toEqual(0);
      });
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

  const initializeTestTasks = () => {
    testTasks = [
      {
        id: '42DA',
        name: 'Find the answer',
        description: 'First find Deep Thought, then get the answer from it',
        enteredOn: fakeTimestamp(14324053),
        type: TaskTypes.feature,
        status: Statuses.closed,
        priority: Priorities.normal,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: fakeTimestamp(1340059420),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: fakeTimestamp(1039950234),
        type: TaskTypes.research,
        status: Statuses.onHold,
        priority: Priorities.low,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '39940500987',
        name: 'Respond to Review',
        description: 'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
        enteredOn: fakeTimestamp(9940593),
        type: TaskTypes.feature,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '119490SDF1945',
        name: 'Create Test Data',
        description: 'Creating test data sucks',
        enteredOn: fakeTimestamp(1486594025),
        type: TaskTypes.research,
        status: Statuses.closed,
        priority: Priorities.low,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: fakeTimestamp(293591432),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.high,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '42DA424242',
        name: 'I am stuck on the answer',
        description: 'First find Deep Thought, then get the answer from it, then puzzle over it',
        enteredOn: fakeTimestamp(1432405339),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.normal,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
      {
        id: '9999',
        name: 'Die',
        description: 'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: fakeTimestamp(114324053),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '314159PI',
        projectName: 'Cherry',
      },
    ];
  };
});
