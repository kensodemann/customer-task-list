import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TaskEditorComponent } from '@app/editors';
import { Task } from '@app/models/task';
import { TasksService } from '@app/services/firestore-data';
import { createTasksServiceMock } from '@app/services/firestore-data/mocks';
import { SharedModule } from '@app/shared';
import { logout } from '@app/store/actions/auth.actions';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock,
  fakeTimestamp,
} from '@test/mocks';
import { Subject } from 'rxjs';
import { TasksPage } from './tasks.page';

describe('TasksPage', () => {
  let alert: any;
  let fixture: ComponentFixture<TasksPage>;
  let modal: any;
  let page: TasksPage;
  let taskList: Subject<Array<Task>>;
  let testTasks: Array<Task>;
  let inProcessTasks: Array<Task>;
  let openTasks: Array<Task>;
  let onHoldTasks: Array<Task>;
  let closedTasks: Array<Task>;

  beforeEach(
    waitForAsync(() => {
      alert = createOverlayElementMock();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [TasksPage],
        imports: [SharedModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
          {
            provide: AlertController,
            useFactory: () => createOverlayControllerMock(alert),
          },
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
          { provide: NavController, useFactory: createNavControllerMock },
          { provide: TasksService, useFactory: createTasksServiceMock },
          provideMockStore(),
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    const tasks = TestBed.inject(TasksService);
    taskList = new Subject();
    (tasks.all as jest.Mock).mockReturnValue(taskList);
    (tasks.forProject as jest.Mock).mockReturnValue(taskList);
    initializeTestTasks();
    fixture = TestBed.createComponent(TasksPage);
    page = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(page).toBeTruthy();
  });

  it('gets the project id and status from the route', () => {
    const route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(2);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('projectId');
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('status');
  });

  it('it does not show the back button if navigated to normally', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as jest.Mock).mockReturnValue(undefined);
    fixture.detectChanges();
    expect(page.showBackButton).toBeFalsy();
  });

  it('it shows the back button if navigated to for a project', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.paramMap.get = jest.fn(arg => {
      if (arg === 'projectId') {
        return '1234';
      }
    });
    fixture.detectChanges();
    expect(page.showBackButton).toBeTruthy();
  });

  it('sets up an observable on all tasks if there is no project', () => {
    const tasks = TestBed.inject(TasksService);
    fixture.detectChanges();
    expect(tasks.all).toHaveBeenCalledTimes(1);
    expect(tasks.forProject).not.toHaveBeenCalled();
  });

  it('sets up an observable on the project tasks if there is a cutomer', () => {
    const route = TestBed.inject(ActivatedRoute);
    const tasks = TestBed.inject(TasksService);
    route.snapshot.paramMap.get = jest.fn(arg => {
      if (arg === 'projectId') {
        return '33859940039kkd032';
      }
    });
    fixture.detectChanges();
    expect(tasks.all).not.toHaveBeenCalled();
    expect(tasks.forProject).toHaveBeenCalledTimes(1);
    expect(tasks.forProject).toHaveBeenCalledWith('33859940039kkd032');
  });

  describe('in process tasks', () => {
    it('returns in process tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.inProcessTasks).toEqual(inProcessTasks);
    });

    it('returns in process tasks if status of in process specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.inProcess;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.inProcessTasks).toEqual(inProcessTasks);
    });

    it('returns empty array if status other than open is specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.closed;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.inProcessTasks).toEqual([]);
    });
  });

  describe('open tasks', () => {
    it('returns open tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual(openTasks);
    });

    it('returns open tasks if status of open specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.open;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual(openTasks);
    });

    it('returns empty array if status other than open is specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.closed;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual([]);
    });
  });

  describe('on hold tasks', () => {
    it('returns on hold tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual(onHoldTasks);
    });

    it('returns On Hold tasks if status of On Hold specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.onHold;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual(onHoldTasks);
    });

    it('returns empty array if status other than on hold is specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.open;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual([]);
    });
  });

  describe('closed tasks', () => {
    it('returns closed tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual(closedTasks);
    });

    it('returns closed tasks if status of closed specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.closed;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual(closedTasks);
    });

    it('returns empty array if status other than closed is specified', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        } else if (arg === 'status') {
          return Statuses.onHold;
        }
      });
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual([]);
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    const task: Task = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: fakeTimestamp(14324053),
      type: TaskTypes.feature,
      status: Statuses.open,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    };

    it('saves the task', () => {
      const tasks = TestBed.inject(TasksService);
      page.close(task);
      expect(tasks.update).toHaveBeenCalledTimes(1);
    });

    it('sets the status to closed', () => {
      const expected = { ...task, status: Statuses.closed };
      const tasks = TestBed.inject(TasksService);
      page.close(task);
      expect(tasks.update).toHaveBeenCalledWith(expected);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    const task: Task = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: fakeTimestamp(14324053),
      type: TaskTypes.feature,
      status: Statuses.closed,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    };

    it('creates an alert', () => {
      const alertController = TestBed.inject(AlertController);
      page.delete(task);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await page.delete(task);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      const alertController = TestBed.inject(AlertController);
      const tasks = TestBed.inject(TasksService);
      page.delete(task);
      const button = (alertController.create as jest.Mock).mock.calls[0][0]
        .buttons[0];
      button.handler();
      expect(tasks.delete).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      const alertController = TestBed.inject(AlertController);
      page.delete(task);
      const button = (alertController.create as jest.Mock).mock.calls[0][0]
        .buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });

  describe('add task', () => {
    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component', () => {
      const modalController = TestBed.inject(ModalController);
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: TaskEditorComponent,
      });
    });

    it('passes the project ID if one is specified in the route', () => {
      const modalController = TestBed.inject(ModalController);
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jest.fn(arg => {
        if (arg === 'projectId') {
          return '33859940039kkd032';
        }
      });
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: TaskEditorComponent,
        componentProps: { projectId: '33859940039kkd032' },
      });
    });

    it('presents the modal', async () => {
      fixture.detectChanges();
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('view task', () => {
    [
      {
        case: 'standard',
        projectId: undefined,
        status: undefined,
        path: ['tabs', 'tasks', 'S9590FGS'],
      },
      {
        case: 'project',
        projectId: '451BK',
        status: undefined,
        path: ['tabs', 'projects', '451BK', 'tasks', 'task', 'S9590FGS'],
      },
      {
        case: 'project status',
        projectId: '451BK',
        status: 'On Hold',
        path: [
          'tabs',
          'projects',
          '451BK',
          'tasks',
          'On Hold',
          'task',
          'S9590FGS',
        ],
      },
    ].forEach(test => {
      it(`navigates to the task from the ${test.case} task list`, () => {
        const navController = TestBed.inject(NavController);
        const route = TestBed.inject(ActivatedRoute);
        route.snapshot.paramMap.get = jest.fn(arg => {
          if (arg === 'projectId') {
            return test.projectId;
          }
          if (arg === 'status') {
            return test.status;
          }
        });
        fixture.detectChanges();
        page.view({
          id: 'S9590FGS',
          name: 'Model It',
          description: 'They need to see it to believe it',
          enteredOn: fakeTimestamp(1440059420),
          type: TaskTypes.research,
          status: Statuses.onHold,
          priority: Priorities.low,
          projectId: '451BK',
          projectName: 'Book Burners R Us',
        });
        expect(navController.navigateForward).toHaveBeenCalledTimes(1);
        expect(navController.navigateForward).toHaveBeenCalledWith(test.path);
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
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: fakeTimestamp(1440059420),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: fakeTimestamp(1039950234),
        type: TaskTypes.research,
        status: Statuses.onHold,
        priority: Priorities.low,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '39940500987',
        name: 'Respond to Review',
        description:
          'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
        enteredOn: fakeTimestamp(9940593),
        type: TaskTypes.feature,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '314PI',
        projectName: 'Baker Baker',
      },
      {
        id: '119490SDF1945',
        name: 'Create Test Data',
        description: 'Creating test data sucks',
        enteredOn: fakeTimestamp(1536594025),
        type: TaskTypes.research,
        status: Statuses.closed,
        priority: Priorities.low,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: fakeTimestamp(914324053),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.high,
        projectId: '314PI',
        projectName: 'Baker Baker',
      },
      {
        id: '42DA424242',
        name: 'I am stuck on the answer',
        description:
          'First find Deep Thought, then get the answer from it, then puzzle over it',
        enteredOn: fakeTimestamp(1432405945),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '9999',
        name: 'Die',
        description:
          'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: fakeTimestamp(1114324053),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '5599tuy838499395',
        name: 'Why is the sky blue?',
        description:
          'I try to make it other colors, but it does not work. Find out why.',
        enteredOn: fakeTimestamp(1586884995),
        type: TaskTypes.research,
        status: Statuses.inProcess,
        priority: Priorities.low,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '11111',
        name: 'One',
        description: 'One one one one one',
        enteredOn: fakeTimestamp(1324053),
        type: TaskTypes.feature,
        status: Statuses.closed,
        priority: Priorities.low,
        projectId: '314PI',
        projectName: 'Baker Baker',
      },
      {
        id: '985SUCK34IT',
        name: 'The rain is wet',
        description: 'Find out why rain is so damn wet',
        enteredOn: fakeTimestamp(1014324053),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '49499503fkkei395',
        name: 'The snow is hot',
        description:
          'I got burned by the snow today. I thought it was supposed to be cold.',
        enteredOn: fakeTimestamp(2948588495),
        type: TaskTypes.bug,
        status: Statuses.inProcess,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '3948SLIP',
        name: 'People === Shit',
        description: 'You know it to be true',
        enteredOn: fakeTimestamp(1351424053),
        type: TaskTypes.feature,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '42DA399458',
        name: 'Displute the answer',
        description:
          'First find Deep Thought, then get the answer from it, then argue about that shit',
        enteredOn: fakeTimestamp(1432405339),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.low,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '19945005996',
        name: 'Pull from the dark',
        description: 'Eliminate your enemy',
        enteredOn: fakeTimestamp(948859023),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '73SC',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430034),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
    ];

    inProcessTasks = [
      {
        id: '49499503fkkei395',
        name: 'The snow is hot',
        description:
          'I got burned by the snow today. I thought it was supposed to be cold.',
        enteredOn: fakeTimestamp(2948588495),
        type: TaskTypes.bug,
        status: Statuses.inProcess,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '5599tuy838499395',
        name: 'Why is the sky blue?',
        description:
          'I try to make it other colors, but it does not work. Find out why.',
        enteredOn: fakeTimestamp(1586884995),
        type: TaskTypes.research,
        status: Statuses.inProcess,
        priority: Priorities.low,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
    ];

    openTasks = [
      {
        id: '39940500987',
        name: 'Respond to Review',
        description:
          'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
        enteredOn: fakeTimestamp(9940593),
        type: TaskTypes.feature,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '314PI',
        projectName: 'Baker Baker',
      },
      {
        id: '19945005996',
        name: 'Pull from the dark',
        description: 'Eliminate your enemy',
        enteredOn: fakeTimestamp(948859023),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '985SUCK34IT',
        name: 'The rain is wet',
        description: 'Find out why rain is so damn wet',
        enteredOn: fakeTimestamp(1014324053),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '9999',
        name: 'Die',
        description:
          'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: fakeTimestamp(1114324053),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '3948SLIP',
        name: 'People === Shit',
        description: 'You know it to be true',
        enteredOn: fakeTimestamp(1351424053),
        type: TaskTypes.feature,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: fakeTimestamp(1440059420),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.high,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '73SC',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: fakeTimestamp(1432430034),
        type: TaskTypes.task,
        status: Statuses.open,
        priority: Priorities.normal,
        projectId: '49950',
        projectName: 'Dolphin Schools',
      },
      {
        id: '42DA399458',
        name: 'Displute the answer',
        description:
          'First find Deep Thought, then get the answer from it, then argue about that shit',
        enteredOn: fakeTimestamp(1432405339),
        type: TaskTypes.research,
        status: Statuses.open,
        priority: Priorities.low,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
    ];

    onHoldTasks = [
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: fakeTimestamp(914324053),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.high,
        projectId: '314PI',
        projectName: 'Baker Baker',
      },
      {
        id: '42DA424242',
        name: 'I am stuck on the answer',
        description:
          'First find Deep Thought, then get the answer from it, then puzzle over it',
        enteredOn: fakeTimestamp(1432405945),
        type: TaskTypes.review,
        status: Statuses.onHold,
        priority: Priorities.normal,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: fakeTimestamp(1039950234),
        type: TaskTypes.research,
        status: Statuses.onHold,
        priority: Priorities.low,
        projectId: '451BK',
        projectName: 'Book Burners R Us',
      },
    ];
    closedTasks = testTasks.filter(t => t.status === Statuses.closed);
  };
});
