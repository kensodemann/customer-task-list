import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { Priorities, Statuses, TaskTypes } from '../default-data';
import { SharedModule } from '../shared/shared.module';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';
import { TasksPage } from './tasks.page';
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
  let modal;
  let modalController;
  let page: TasksPage;
  let tasks;
  let taskList: Subject<Array<TaskWithId>>;
  let testTasks: Array<TaskWithId>;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    authentication = createAuthenticationServiceMock();
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    tasks = createTasksServiceMock();
    taskList = new Subject();
    tasks.all.and.returnValue(taskList);
    TestBed.configureTestingModule({
      declarations: [TasksPage],
      imports: [SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useValue: alertController },
        { provide: AuthenticationService, useValue: authentication },
        { provide: ModalController, useValue: modalController },
        { provide: TasksService, useValue: tasks }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    initializeTestTasks();
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

  describe('open tasks', () => {
    it('returns an empty array before tasks are obtained', () => {
      expect(page.openTasks).toEqual([]);
    });

    it('returns open tasks after loading', () => {
      taskList.next(testTasks);
      expect(page.openTasks).toEqual([
        {
          id: '39940500987',
          name: 'Respond to Review',
          description:
            'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
          enteredOn: { nanoseconds: 0, seconds: 9940593 },
          type: TaskTypes.FollowUp,
          status: Statuses.Open,
          priority: Priorities.High,
          customerId: '314PI',
          customerName: 'Baker Baker'
        },
        {
          id: '9999',
          name: 'Die',
          description:
            'We all want to go to heaven, but no one wants to die to get there',
          enteredOn: { nanoseconds: 0, seconds: 22114324053 },
          type: TaskTypes.ProofOfConcept,
          status: Statuses.Open,
          priority: Priorities.High,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '3948SLIP',
          name: 'People === Shit',
          description: 'You know it to be true',
          enteredOn: { nanoseconds: 0, seconds: 39514324053 },
          type: TaskTypes.FollowUp,
          status: Statuses.Open,
          priority: Priorities.High,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '42DA399458',
          name: 'Displute the answer',
          description:
            'First find Deep Thought, then get the answer from it, then argue about that shit',
          enteredOn: { nanoseconds: 0, seconds: 1432405339495 },
          type: TaskTypes.Research,
          status: Statuses.Open,
          priority: Priorities.Low,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '19945005996',
          name: 'Pull from the dark',
          description: 'Eliminate your enemy',
          enteredOn: { nanoseconds: 0, seconds: 49948859023 },
          type: TaskTypes.ProofOfConcept,
          status: Statuses.Open,
          priority: Priorities.High,
          customerId: '49950',
          customerName: 'Dolphin Schools'
        },
        {
          id: '73SC',
          name: 'Bang the Big',
          description: 'Just like it sounds there captain',
          enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
          type: TaskTypes.Meeting,
          status: Statuses.Open,
          priority: Priorities.Normal,
          customerId: '49950',
          customerName: 'Dolphin Schools'
        }
      ]);
    });
  });

  describe('repeating tasks', () => {
    it('returns an empty array before tasks are obtained', () => {
      expect(page.repeatingTasks).toEqual([]);
    });

    it('returns repeating tasks after loading', () => {
      taskList.next(testTasks);
      expect(page.repeatingTasks).toEqual([
        {
          id: '399485',
          name: 'Eat some fish',
          description: 'Smartest creatures on Earth like fish',
          enteredOn: { nanoseconds: 0, seconds: 993840059420 },
          type: TaskTypes.Meeting,
          status: Statuses.Repeating,
          priority: Priorities.High,
          customerId: '49950',
          customerName: 'Dolphin Schools'
        },
        {
          id: '985SUCK34IT',
          name: 'The rain is wet',
          description: 'Find out why rain is so damn wet',
          enteredOn: { nanoseconds: 0, seconds: 2995014324053 },
          type: TaskTypes.Research,
          status: Statuses.Repeating,
          priority: Priorities.High,
          customerId: '49950',
          customerName: 'Dolphin Schools'
        }
      ]);
    });
  });

  describe('on hold tasks', () => {
    it('returns an empty array before tasks are obtained', () => {
      expect(page.onHoldTasks).toEqual([]);
    });

    it('returns on hold tasks after loading', () => {
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual([
        {
          id: 'S9590FGS',
          name: 'Model It',
          description: 'They need to see it to believe it',
          enteredOn: { nanoseconds: 0, seconds: 994039950234 },
          type: TaskTypes.ProofOfConcept,
          status: Statuses.OnHold,
          priority: Priorities.Low,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '399405',
          name: 'Eat some chicken',
          description: 'It is good',
          enteredOn: { nanoseconds: 0, seconds: 2935914324053 },
          type: TaskTypes.Review,
          status: Statuses.OnHold,
          priority: Priorities.High,
          customerId: '314PI',
          customerName: 'Baker Baker'
        },
        {
          id: '42DA424242',
          name: 'I am stuck on the answer',
          description:
            'First find Deep Thought, then get the answer from it, then puzzle over it',
          enteredOn: { nanoseconds: 0, seconds: 1432405339945 },
          type: TaskTypes.Review,
          status: Statuses.OnHold,
          priority: Priorities.Normal,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        }
      ]);
    });
  });

  describe('closed tasks', () => {
    it('returns an empty array before tasks are obtained', () => {
      expect(page.closedTasks).toEqual([]);
    });

    it('returns closed tasks after loading', () => {
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual([
        {
          id: '42DA',
          name: 'Find the answer',
          description: 'First find Deep Thought, then get the answer from it',
          enteredOn: { nanoseconds: 0, seconds: 14324053 },
          type: TaskTypes.FollowUp,
          status: Statuses.Closed,
          priority: Priorities.Normal,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '119490SDF1945',
          name: 'Create Test Data',
          description: 'Creating test data sucks',
          enteredOn: { nanoseconds: 0, seconds: 15886594025 },
          type: TaskTypes.Research,
          status: Statuses.Closed,
          priority: Priorities.Low,
          customerId: '451BK',
          customerName: 'Book Burners R Us'
        },
        {
          id: '11111',
          name: 'One',
          description: 'One one one one one',
          enteredOn: { nanoseconds: 0, seconds: 1324053 },
          type: TaskTypes.FollowUp,
          status: Statuses.Closed,
          priority: Priorities.Low,
          customerId: '314PI',
          customerName: 'Baker Baker'
        }
      ]);
    });
  });

  describe('delete', () => {
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

  describe('add task', () => {
    it('creates a modal', () => {
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component', () => {
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent
      });
    });

    it('presents the modal', async () => {
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
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

    it('creates a modal', () => {
      page.edit(task);
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component and passes the current task', () => {
      page.edit(task);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent,
        componentProps: { task: task }
      });
    });

    it('presents the modal', async () => {
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  function initializeTestTasks() {
    testTasks = [
      {
        id: '42DA',
        name: 'Find the answer',
        description: 'First find Deep Thought, then get the answer from it',
        enteredOn: { nanoseconds: 0, seconds: 14324053 },
        type: TaskTypes.FollowUp,
        status: Statuses.Closed,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: { nanoseconds: 0, seconds: 993840059420 },
        type: TaskTypes.Meeting,
        status: Statuses.Repeating,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: { nanoseconds: 0, seconds: 994039950234 },
        type: TaskTypes.ProofOfConcept,
        status: Statuses.OnHold,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '39940500987',
        name: 'Respond to Review',
        description:
          'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
        enteredOn: { nanoseconds: 0, seconds: 9940593 },
        type: TaskTypes.FollowUp,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '314PI',
        customerName: 'Baker Baker'
      },
      {
        id: '119490SDF1945',
        name: 'Create Test Data',
        description: 'Creating test data sucks',
        enteredOn: { nanoseconds: 0, seconds: 15886594025 },
        type: TaskTypes.Research,
        status: Statuses.Closed,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: { nanoseconds: 0, seconds: 2935914324053 },
        type: TaskTypes.Review,
        status: Statuses.OnHold,
        priority: Priorities.High,
        customerId: '314PI',
        customerName: 'Baker Baker'
      },
      {
        id: '42DA424242',
        name: 'I am stuck on the answer',
        description:
          'First find Deep Thought, then get the answer from it, then puzzle over it',
        enteredOn: { nanoseconds: 0, seconds: 1432405339945 },
        type: TaskTypes.Review,
        status: Statuses.OnHold,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '9999',
        name: 'Die',
        description:
          'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: { nanoseconds: 0, seconds: 22114324053 },
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '11111',
        name: 'One',
        description: 'One one one one one',
        enteredOn: { nanoseconds: 0, seconds: 1324053 },
        type: TaskTypes.FollowUp,
        status: Statuses.Closed,
        priority: Priorities.Low,
        customerId: '314PI',
        customerName: 'Baker Baker'
      },
      {
        id: '985SUCK34IT',
        name: 'The rain is wet',
        description: 'Find out why rain is so damn wet',
        enteredOn: { nanoseconds: 0, seconds: 2995014324053 },
        type: TaskTypes.Research,
        status: Statuses.Repeating,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: '3948SLIP',
        name: 'People === Shit',
        description: 'You know it to be true',
        enteredOn: { nanoseconds: 0, seconds: 39514324053 },
        type: TaskTypes.FollowUp,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '42DA399458',
        name: 'Displute the answer',
        description:
          'First find Deep Thought, then get the answer from it, then argue about that shit',
        enteredOn: { nanoseconds: 0, seconds: 1432405339495 },
        type: TaskTypes.Research,
        status: Statuses.Open,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '19945005996',
        name: 'Pull from the dark',
        description: 'Eliminate your enemy',
        enteredOn: { nanoseconds: 0, seconds: 49948859023 },
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: '73SC',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      }
    ];
  }
});
