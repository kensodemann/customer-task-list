import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController
} from '@ionic/angular';
import { firestore } from 'firebase/app';
import { Subject } from 'rxjs';

import { Priorities, Statuses, TaskTypes } from '../../default-data';
import { SharedModule } from '../../shared/shared.module';
import { TaskEditorComponent } from '../../editors/task-editor/task-editor.component';
import { TasksPage } from './tasks.page';
import { TasksService } from '../../services/firestore-data/tasks/tasks.service';
import { TaskWithId } from '../../models/task';

import { createTasksServiceMock } from '../../services/firestore-data/tasks/tasks.mock';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';

describe('TasksPage', () => {
  let alert;
  let fixture: ComponentFixture<TasksPage>;
  let modal;
  let page: TasksPage;
  let taskList: Subject<Array<TaskWithId>>;
  let testTasks: Array<TaskWithId>;
  let openTasks: Array<TaskWithId>;
  let repeatingTasks: Array<TaskWithId>;
  let onHoldTasks: Array<TaskWithId>;
  let closedTasks: Array<TaskWithId>;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [TasksPage],
      imports: [SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        {
          provide: AlertController,
          useFactory: () =>
            createOverlayControllerMock('AlertController', alert)
        },
        {
          provide: ModalController,
          useFactory: () =>
            createOverlayControllerMock('ModalController', modal)
        },
        { provide: NavController, useFactory: createNavControllerMock },
        { provide: TasksService, useFactory: createTasksServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const tasks = TestBed.get(TasksService);
    taskList = new Subject();
    tasks.all.and.returnValue(taskList);
    tasks.forCustomer.and.returnValue(taskList);
    initializeTestTasks();
    fixture = TestBed.createComponent(TasksPage);
    page = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(page).toBeTruthy();
  });

  it('gets the customer id and status from the route', () => {
    const route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(2);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('customerId');
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('status');
  });

  it('sets up an observable on all tasks if there is no customer', () => {
    const tasks = TestBed.get(TasksService);
    fixture.detectChanges();
    expect(tasks.all).toHaveBeenCalledTimes(1);
    expect(tasks.forCustomer).not.toHaveBeenCalled();
  });

  it('sets up an observable on the customer tasks if there is a cutomer', () => {
    const route = TestBed.get(ActivatedRoute);
    const tasks = TestBed.get(TasksService);
    route.snapshot.paramMap.get
      .withArgs('customerId')
      .and.returnValue('33859940039kkd032');
    route.snapshot.paramMap.get.withArgs('status').and.returnValue(undefined);
    fixture.detectChanges();
    expect(tasks.all).not.toHaveBeenCalled();
    expect(tasks.forCustomer).toHaveBeenCalledTimes(1);
    expect(tasks.forCustomer).toHaveBeenCalledWith('33859940039kkd032');
  });

  describe('open tasks', () => {
    it('returns open tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual(openTasks);
    });

    it('returns open tasks if status of open specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Open);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual(openTasks);
    });

    it('returns empty array if status other than open is specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Closed);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.openTasks).toEqual([]);
    });
  });

  describe('repeating tasks', () => {
    it('returns repeating tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.repeatingTasks).toEqual(repeatingTasks);
    });

    it('returns repeating tasks if status of repeating specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Repeating);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.repeatingTasks).toEqual(repeatingTasks);
    });

    it('returns empty array if status other than repeating is specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Open);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.repeatingTasks).toEqual([]);
    });
  });

  describe('on hold tasks', () => {
    it('returns on hold tasks after loading', () => {
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual(onHoldTasks);
    });

    it('returns On Hold tasks if status of On Hold specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.OnHold);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.onHoldTasks).toEqual(onHoldTasks);
    });

    it('returns empty array if status other than on hold is specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Repeating);
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
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.Closed);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual(closedTasks);
    });

    it('returns empty array if status other than closed is specified', () => {
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get
        .withArgs('status')
        .and.returnValue(Statuses.OnHold);
      fixture.detectChanges();
      taskList.next(testTasks);
      expect(page.closedTasks).toEqual([]);
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    const task: TaskWithId = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: new firestore.Timestamp(14324053, 0),
      type: TaskTypes.FollowUp,
      status: Statuses.Open,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    };

    it('saves the task', () => {
      const tasks = TestBed.get(TasksService);
      page.close(task);
      expect(tasks.update).toHaveBeenCalledTimes(1);
    });

    it('sets the status to closed', () => {
      const expected = { ...task, status: Statuses.Closed };
      const tasks = TestBed.get(TasksService);
      page.close(task);
      expect(tasks.update).toHaveBeenCalledWith(expected);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    const task: TaskWithId = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: new firestore.Timestamp(14324053, 0),
      type: TaskTypes.FollowUp,
      status: Statuses.Closed,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    };

    it('creates an alert', () => {
      const alertController = TestBed.get(AlertController);
      page.delete(task);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await page.delete(task);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      const alertController = TestBed.get(AlertController);
      const tasks = TestBed.get(TasksService);
      page.delete(task);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(tasks.delete).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      const alertController = TestBed.get(AlertController);
      page.delete(task);
      const button = alertController.create.calls.argsFor(0)[0].buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });

  describe('add task', () => {
    it('creates a modal', () => {
      const modalController = TestBed.get(ModalController);
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component', () => {
      const modalController = TestBed.get(ModalController);
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent
      });
    });

    it('passes the customer ID if one is specified in the route', () => {
      const modalController = TestBed.get(ModalController);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get
        .withArgs('customerId')
        .and.returnValue('33859940039kkd032');
      route.snapshot.paramMap.get.withArgs('status').and.returnValue(undefined);
      fixture.detectChanges();
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent,
        componentProps: { customerId: '33859940039kkd032' }
      });
    });

    it('presents the modal', async () => {
      fixture.detectChanges();
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('view customer', () => {
    it('navigates to the customer', () => {
      const navController = TestBed.get(NavController);
      fixture.detectChanges();
      page.view({
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: new firestore.Timestamp(1440059420, 0),
        type: TaskTypes.ProofOfConcept,
        status: Statuses.OnHold,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      });
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith([
        'task',
        'S9590FGS'
      ]);
    });
  });

  function initializeTestTasks() {
    testTasks = [
      {
        id: '42DA',
        name: 'Find the answer',
        description: 'First find Deep Thought, then get the answer from it',
        enteredOn: new firestore.Timestamp(14324053, 0),
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
        enteredOn: new firestore.Timestamp(1440059420, 0),
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
        enteredOn: new firestore.Timestamp(1039950234, 0),
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
        enteredOn: new firestore.Timestamp(9940593, 0),
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
        enteredOn: new firestore.Timestamp(1536594025, 0),
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
        enteredOn: new firestore.Timestamp(914324053, 0),
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
        enteredOn: new firestore.Timestamp(1432405945, 0),
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
        enteredOn: new firestore.Timestamp(1114324053, 0),
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
        enteredOn: new firestore.Timestamp(1324053, 0),
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
        enteredOn: new firestore.Timestamp(1014324053, 0),
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
        enteredOn: new firestore.Timestamp(1351424053, 0),
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
        enteredOn: new firestore.Timestamp(1432405339, 0),
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
        enteredOn: new firestore.Timestamp(948859023, 0),
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
        enteredOn: new firestore.Timestamp(1432430034, 0),
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      }
    ];

    openTasks = [
      {
        id: '39940500987',
        name: 'Respond to Review',
        description:
          'We reviewed their code. It sucked. Find a nice way to tell them how much they suck',
        enteredOn: new firestore.Timestamp(9940593, 0),
        type: TaskTypes.FollowUp,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '314PI',
        customerName: 'Baker Baker'
      },
      {
        id: '19945005996',
        name: 'Pull from the dark',
        description: 'Eliminate your enemy',
        enteredOn: new firestore.Timestamp(948859023, 0),
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: '9999',
        name: 'Die',
        description:
          'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: new firestore.Timestamp(1114324053, 0),
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
        enteredOn: new firestore.Timestamp(1351424053, 0),
        type: TaskTypes.FollowUp,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: '73SC',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: new firestore.Timestamp(1432430034, 0),
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: '42DA399458',
        name: 'Displute the answer',
        description:
          'First find Deep Thought, then get the answer from it, then argue about that shit',
        enteredOn: new firestore.Timestamp(1432405339, 0),
        type: TaskTypes.Research,
        status: Statuses.Open,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
    ];
    repeatingTasks = [
      {
        id: '985SUCK34IT',
        name: 'The rain is wet',
        description: 'Find out why rain is so damn wet',
        enteredOn: new firestore.Timestamp(1014324053, 0),
        type: TaskTypes.Research,
        status: Statuses.Repeating,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: new firestore.Timestamp(1440059420, 0),
        type: TaskTypes.Meeting,
        status: Statuses.Repeating,
        priority: Priorities.High,
        customerId: '49950',
        customerName: 'Dolphin Schools'
      }
    ];
    onHoldTasks = [
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: new firestore.Timestamp(914324053, 0),
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
        enteredOn: new firestore.Timestamp(1432405945, 0),
        type: TaskTypes.Review,
        status: Statuses.OnHold,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: new firestore.Timestamp(1039950234, 0),
        type: TaskTypes.ProofOfConcept,
        status: Statuses.OnHold,
        priority: Priorities.Low,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      }
    ];
    closedTasks = testTasks.filter(t => t.status === Statuses.Closed);
  }
});
