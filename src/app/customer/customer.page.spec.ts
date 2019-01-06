import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { CustomerPage } from './customer.page';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';
import { NoteEditorComponent } from '../editors/note-editor/note-editor.component';
import { NotesService } from '../services/notes/notes.service';
import { Priorities, Statuses, TaskTypes } from '../default-data';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

import { createCustomersServiceMock } from '../services/customers/customers.mock';
import { createNotesServiceMock } from '../services/notes/notes.mock';
import { createTasksServiceMock } from '../services/tasks/tasks.mock';
import {
  createActivatedRouteMock,
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CustomerPage', () => {
  let page: CustomerPage;
  let customers;
  let fixture: ComponentFixture<CustomerPage>;
  let modal;
  let modalController;
  let navController;
  let notes;
  let route;
  let tasks;
  let testTasks: Array<TaskWithId>;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    navController = createNavControllerMock();
    notes = createNotesServiceMock();
    route = createActivatedRouteMock();
    tasks = createTasksServiceMock();
    TestBed.configureTestingModule({
      declarations: [CustomerPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modalController },
        { provide: NavController, useValue: navController },
        { provide: NotesService, useValue: notes },
        { provide: TasksService, useValue: tasks }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
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
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('get the customer for the id', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(customers.get).toHaveBeenCalledTimes(1);
    expect(customers.get).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the customer', () => {
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
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.forCustomer).toHaveBeenCalledTimes(1);
    expect(tasks.forCustomer).toHaveBeenCalledWith('314159PI');
  });

  it('gets the notes for the customer', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(notes.allFor).toHaveBeenCalledTimes(1);
    expect(notes.allFor).toHaveBeenCalledWith('314159PI');
  });

  describe('edit customer', () => {
    const customer: CustomerWithId = {
      id: '4273',
      name: 'Dominos',
      description: 'Pizza apps that rock, the pizza not so much',
      isActive: true
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('4273');
      customers.get.and.returnValue(of(customer));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component and passes the customer', () => {
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
        expect(page.taskCount(Statuses.Open)).toEqual(2);
      });

      it('counts the repeating tasks', () => {
        expect(page.taskCount(Statuses.Repeating)).toEqual(1);
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

  describe('add note', () => {
    const customer: CustomerWithId = {
      id: '4273',
      name: 'Dominos',
      description: 'Pizza apps that rock, the pizza not so much',
      isActive: true
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('4273');
      customers.get.and.returnValue(of(customer));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      page.addNote();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the current task ID', () => {
      page.addNote();
      expect(modalController.create).toHaveBeenCalledWith({
        component: NoteEditorComponent,
        componentProps: { itemId: customer.id }
      });
    });

    it('presents the modal', async () => {
      await page.addNote();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('view note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      page.viewNote({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
      });
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the note to view', () => {
      page.viewNote({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
      });
      expect(modalController.create).toHaveBeenCalledWith({
        component: NoteEditorComponent,
        componentProps: {
          note: {
            id: '4277785',
            text: 'this is just a test note, nothing more',
            itemId: '314159PI',
            enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
          }
        }
      });
    });

    it('presents the modal', async () => {
      await page.viewNote({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
      });
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
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: '399485',
        name: 'Eat some fish',
        description: 'Smartest creatures on Earth like fish',
        enteredOn: { nanoseconds: 0, seconds: 993840059420 },
        type: TaskTypes.Meeting,
        status: Statuses.Repeating,
        priority: Priorities.High,
        customerId: '314159PI',
        customerName: 'Cherry'
      },
      {
        id: 'S9590FGS',
        name: 'Model It',
        description: 'They need to see it to believe it',
        enteredOn: { nanoseconds: 0, seconds: 994039950234 },
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
        enteredOn: { nanoseconds: 0, seconds: 9940593 },
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
        enteredOn: { nanoseconds: 0, seconds: 15886594025 },
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
        enteredOn: { nanoseconds: 0, seconds: 2935914324053 },
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
        enteredOn: { nanoseconds: 0, seconds: 1432405339945 },
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
        enteredOn: { nanoseconds: 0, seconds: 22114324053 },
        type: TaskTypes.ProofOfConcept,
        status: Statuses.Open,
        priority: Priorities.High,
        customerId: '314159PI',
        customerName: 'Cherry'
      }
    ];
  }
});
