import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { CustomerEditorComponent } from '../../editors/customer-editor/customer-editor.component';
import { CustomerPage } from './customer.page';
import { CustomersService } from '../../services/firestore-data/customers/customers.service';
import { CustomerWithId } from '../../models/customer';
import { Priorities, Statuses, TaskTypes } from '../../default-data';
import { TasksService } from '../../services/firestore-data/tasks/tasks.service';
import { TaskWithId } from '../../models/task';

import { createCustomersServiceMock } from '../../services/firestore-data/customers/customers.mock';
import { createTasksServiceMock } from '../../services/firestore-data/tasks/tasks.mock';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../../test/mocks';

describe('CustomerPage', () => {
  let page: CustomerPage;
  let fixture: ComponentFixture<CustomerPage>;
  let modal;
  let testTasks: Array<TaskWithId>;

  beforeEach(async(() => {
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [CustomerPage],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        { provide: CustomersService, useFactory: createCustomersServiceMock },
        {
          provide: ModalController,
          useFactory: () =>
            createOverlayControllerMock('ModalController', modal)
        },
        { provide: NavController, useFactory: createNavControllerMock },
        { provide: TasksService, useFactory: createTasksServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    const tasks = TestBed.get(TasksService);
    initializeTestTasks();
    tasks.forCustomer.and.returnValue(of(testTasks));
    fixture = TestBed.createComponent(CustomerPage);
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
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('get the customer for the id', () => {
    const customers = TestBed.get(CustomersService);
    const route = TestBed.get(ActivatedRoute);
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(customers.get).toHaveBeenCalledTimes(1);
    expect(customers.get).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the customer', () => {
    const customers = TestBed.get(CustomersService);
    const route = TestBed.get(ActivatedRoute);
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    customers.get.and.returnValue(
      of({
        id: '314159PI',
        name: 'Cherry',
        description: 'Makers of really tasty pi',
        isActive: true
      })
    );
    fixture.detectChanges();
    expect(page.customer).toEqual({
      id: '314159PI',
      name: 'Cherry',
      description: 'Makers of really tasty pi',
      isActive: true
    });
  });

  it('gets the tasks for the customer', () => {
    const route = TestBed.get(ActivatedRoute);
    const tasks = TestBed.get(TasksService);
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.forCustomer).toHaveBeenCalledTimes(1);
    expect(tasks.forCustomer).toHaveBeenCalledWith('314159PI');
  });

  describe('edit customer', () => {
    const customer: CustomerWithId = {
      id: '4273',
      name: 'Dominos',
      description: 'Pizza apps that rock, the pizza not so much',
      isActive: true
    };

    beforeEach(() => {
      const customers = TestBed.get(CustomersService);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get.and.returnValue('4273');
      customers.get.and.returnValue(of(customer));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.get(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component and passes the customer', () => {
      const modalController = TestBed.get(ModalController);
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent,
        componentProps: { customer: customer }
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
        expect(page.taskCount(Statuses.Open)).toEqual(3);
      });

      it('counts the on hold tasks', () => {
        expect(page.taskCount(Statuses.OnHold)).toEqual(3);
      });

      it('counts the closed tasks', () => {
        expect(page.taskCount(Statuses.Closed)).toEqual(2);
      });

      it('returns zero if the status is not valid', () => {
        expect(page.taskCount('SomeInvalidStatus')).toEqual(0);
      });
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
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: new firestore.Timestamp(1340059420, 0),
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: new firestore.Timestamp(1039950234, 0),
        type: TaskTypes.ProofOfConcept,
        status: Statuses.OnHold,
        priority: Priorities.Low,
        customerId: '314159PI',
        customerName: 'Cherry'
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
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '119490SDF1945',
        name: 'Create Test Data',
        description: 'Creating test data sucks',
        enteredOn: new firestore.Timestamp(1486594025, 0),
        type: TaskTypes.Research,
        status: Statuses.Closed,
        priority: Priorities.Low,
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '399405',
        name: 'Eat some chicken',
        description: 'It is good',
        enteredOn: new firestore.Timestamp(293591432, 0),
        type: TaskTypes.Review,
        status: Statuses.OnHold,
        priority: Priorities.High,
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '42DA424242',
        name: 'I am stuck on the answer',
        description:
          'First find Deep Thought, then get the answer from it, then puzzle over it',
        enteredOn: new firestore.Timestamp(1432405339, 0),
        type: TaskTypes.Review,
        status: Statuses.OnHold,
        priority: Priorities.Normal,
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '9999',
        name: 'Die',
        description:
          'We all want to go to heaven, but no one wants to die to get there',
        enteredOn: new firestore.Timestamp(114324053, 0),
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '314159PI',
        customerName: 'Cherry'
      }
    ];
  }
});
