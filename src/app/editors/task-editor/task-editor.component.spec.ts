import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { firestore } from 'firebase/app';

import { CustomerWithId } from '../../models/customer';
import { CustomersService } from '../../services/firestore-data/customers/customers.service';
import { TaskEditorComponent } from './task-editor.component';
import { TasksService } from '../../services/firestore-data/tasks/tasks.service';
import { Priorities, Statuses, TaskTypes } from '../../default-data';

import {
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';
import { createCustomersServiceMock } from '../../services/firestore-data/customers/customers.mock';
import { createTasksServiceMock } from '../../services/firestore-data/tasks/tasks.mock';

describe('TaskEditorComponent', () => {
  let allCustomers: Array<CustomerWithId>;
  let editor: TaskEditorComponent;
  let fixture: ComponentFixture<TaskEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: CustomersService, useFactory: createCustomersServiceMock },
        {
          provide: ModalController,
          useFactory: () =>
            createOverlayControllerMock(
              'ModalController',
              createOverlayElementMock('Modal')
            )
        },
        { provide: TasksService, useFactory: createTasksServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    const customers = TestBed.get(CustomersService);
    allCustomers = [
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: false
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: true
      },
      {
        id: '73SC',
        name: 'Wheels',
        description: 'Not what it sounds like',
        isActive: false
      },
      {
        id: '42DA',
        name: 'Deep Sea Divers',
        description: 'Thanks for all the fish!',
        isActive: true
      },
      {
        id: '1138GL',
        name: 'THX Sound Enterprises',
        description: 'Loud, proud, and all around you',
        isActive: true
      },
      {
        id: '531LLS',
        name: 'Lillies Love Secrets',
        description: 'Sexy stuff, currently out of business',
        isActive: false
      },
      {
        id: '705AMS',
        name: 'Ashley Furniture',
        description: 'Moderatly good quality furniture for your boring home',
        isActive: true
      },
      {
        id: '317SP',
        name: 'Harp Brewery',
        description: 'Time to do some puking on your shoes',
        isActive: true
      }
    ];
    customers.all.and.returnValue(of(allCustomers));
    fixture = TestBed.createComponent(TaskEditorComponent);
    editor = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(editor).toBeTruthy();
  });

  it('calculates a max due date', () => {
    jasmine.clock().mockDate(new Date('2018-12-25T14:23:35.000-05:00'));
    fixture.detectChanges();
    expect(editor.maxDate).toEqual('2021-12-25');
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      const modal = TestBed.get(ModalController);
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      jasmine.clock().mockDate(new Date('2018-12-25T14:23:35.000-05:00'));
      fixture.detectChanges();
    });

    it('sets the title to "Add New Task"', () => {
      expect(editor.title).toEqual('Add New Task');
    });

    it('defaults the status to Open', () => {
      expect(editor.status).toEqual(Statuses.Open);
    });

    it('defaults the type to Follow-up', () => {
      expect(editor.taskType).toEqual(TaskTypes.FollowUp);
    });

    it('defaults the priority to Normal', () => {
      expect(editor.priority).toEqual(Priorities.Normal);
    });

    it('gets the customers', () => {
      const customers = TestBed.get(CustomersService);
      expect(customers.all).toHaveBeenCalledTimes(1);
    });

    it('defaults to not scheduling the task', () => {
      expect(editor.schedule).toBeFalsy();
      expect(editor.beginDate).toBeFalsy();
      expect(editor.endDate).toBeFalsy();
    });

    it('maps the active customers', () => {
      expect(editor.activeCustomers).toEqual([
        {
          id: '705AMS',
          name: 'Ashley Furniture'
        },
        {
          id: '42DA',
          name: 'Deep Sea Divers'
        },
        {
          id: '317SP',
          name: 'Harp Brewery'
        },
        {
          id: '420HI',
          name: 'Joe'
        },
        {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        }
      ]);
    });

    describe('toggling the scheduled flag', () => {
      it('sets the dates to today when true', () => {
        editor.schedule = true;
        editor.scheduleChanged();
        expect(editor.beginDate).toEqual('2018-12-25');
        expect(editor.endDate).toEqual('2018-12-25');
      });

      it('clears the dates when false', () => {
        editor.beginDate = '2019-02-09';
        editor.beginDate = '2019-02-12';
        editor.schedule = false;
        editor.scheduleChanged();
        expect(editor.beginDate).toBeFalsy();
        expect(editor.endDate).toBeFalsy();
      });
    });

    describe('changing the begin date', () => {
      beforeEach(() => {
        editor.schedule = true;
        editor.scheduleChanged();
      });

      it('moves the end date to match', () => {
        editor.beginDate = '2019-01-14';
        editor.beginDateChanged();
        expect(editor.endDate).toEqual('2019-01-14');
      });

      it('keeps the gap when the end date changes', () => {
        editor.endDate = '2018-12-27';
        editor.endDateChanged();
        editor.beginDate = '2019-01-14';
        editor.beginDateChanged();
        expect(editor.endDate).toEqual('2019-01-16');
      });
    });

    describe('save', () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date('2018-12-25T14:23:35.000-05:00'));
      });

      it('adds the task', () => {
        const tasks = TestBed.get(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.customerId = '1138GL';
        editor.save();
        expect(tasks.add).toHaveBeenCalledTimes(1);
      });

      it('passes the data', () => {
        const tasks = TestBed.get(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.customerId = '1138GL';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.Open,
          type: TaskTypes.FollowUp,
          priority: Priorities.Normal,
          customerId: '1138GL',
          customerName: 'THX Sound Enterprises',
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('passes the begin and end dates if they exist', () => {
        const tasks = TestBed.get(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.customerId = '1138GL';
        editor.beginDate = '2019-01-03';
        editor.endDate = '2019-01-04';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.Open,
          type: TaskTypes.FollowUp,
          priority: Priorities.Normal,
          customerId: '1138GL',
          customerName: 'THX Sound Enterprises',
          enteredOn: new firestore.Timestamp(1545765815, 0),
          beginDate: '2019-01-03',
          endDate: '2019-01-04'
        });
      });

      it('has a blank customer name if the customer cannot be found', () => {
        const tasks = TestBed.get(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.customerId = '1139GL';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.Open,
          type: TaskTypes.FollowUp,
          priority: Priorities.Normal,
          customerId: '1139GL',
          customerName: undefined,
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('dismisses the modal', () => {
        const modal = TestBed.get(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('in update mode', () => {
    beforeEach(() => {
      jasmine.clock().mockDate(new Date('2019-03-13T12:05:45.000-05:00'));
    });

    describe('without schedule dates', () => {
      beforeEach(() => {
        editor.task = {
          id: '88395AA930FE',
          name: 'Weekly Status Meeting',
          description: 'Weekly status meeting, usually on Thursdays',
          status: Statuses.Repeating,
          priority: Priorities.Low,
          type: TaskTypes.Meeting,
          customerId: '1138GL',
          customerName: 'THX Sound Enterprises',
          enteredOn: new firestore.Timestamp(1545765815, 0)
        };
        fixture.detectChanges();
      });

      it('initializes the schedule flag', () => {
        expect(editor.schedule).toEqual(false);
      });

      describe('toggling the scheduled flag', () => {
        it('sets the dates to today when true', () => {
          editor.schedule = true;
          editor.scheduleChanged();
          expect(editor.beginDate).toEqual('2019-03-13');
          expect(editor.endDate).toEqual('2019-03-13');
        });

        it('clears the dates when false', () => {
          editor.beginDate = '2019-02-09';
          editor.beginDate = '2019-02-12';
          editor.schedule = false;
          editor.scheduleChanged();
          expect(editor.beginDate).toBeFalsy();
          expect(editor.endDate).toBeFalsy();
        });
      });

      describe('changing the begin date', () => {
        beforeEach(() => {
          editor.schedule = true;
          editor.scheduleChanged();
        });

        it('moves the end date to match', () => {
          editor.beginDate = '2019-01-14';
          editor.beginDateChanged();
          expect(editor.endDate).toEqual('2019-01-14');
        });

        it('keeps the gap when the end date changes', () => {
          editor.endDate = '2019-03-15';
          editor.endDateChanged();
          editor.beginDate = '2019-01-14';
          editor.beginDateChanged();
          expect(editor.endDate).toEqual('2019-01-16');
        });
      });
    });

    describe('with schedule dates', () => {
      beforeEach(() => {
        editor.task = {
          id: '88395AA930FE',
          name: 'Weekly Status Meeting',
          description: 'Weekly status meeting, usually on Thursdays',
          status: Statuses.Repeating,
          priority: Priorities.Low,
          type: TaskTypes.Meeting,
          beginDate: '2019-01-15',
          endDate: '2019-01-18',
          customerId: '1138GL',
          customerName: 'THX Sound Enterprises',
          enteredOn: new firestore.Timestamp(1545765815, 0)
        };
        fixture.detectChanges();
      });

      it('sets the title to "Modify Task"', () => {
        expect(editor.title).toEqual('Modify Task');
      });

      it('initializes the name', () => {
        expect(editor.name).toEqual('Weekly Status Meeting');
      });

      it('initializes the description', () => {
        expect(editor.description).toEqual(
          'Weekly status meeting, usually on Thursdays'
        );
      });

      it('initializes the status', () => {
        expect(editor.status).toEqual(Statuses.Repeating);
      });

      it('initializes the task type', () => {
        expect(editor.taskType).toEqual(TaskTypes.Meeting);
      });

      it('initializes the priority', () => {
        expect(editor.priority).toEqual(Priorities.Low);
      });

      it('initializes the begin date', () => {
        expect(editor.beginDate).toEqual('2019-01-15');
      });

      it('initializes the end date', () => {
        expect(editor.endDate).toEqual('2019-01-18');
      });

      it('initializes the schedule flag', () => {
        expect(editor.schedule).toEqual(true);
      });

      it('initializes the customer ID', () => {
        expect(editor.customerId).toEqual('1138GL');
      });

      it('gets the customers', () => {
        const customers = TestBed.get(CustomersService);
        expect(customers.all).toHaveBeenCalledTimes(1);
      });

      it('maps the active customers', () => {
        expect(editor.activeCustomers).toEqual([
          {
            id: '705AMS',
            name: 'Ashley Furniture'
          },
          {
            id: '42DA',
            name: 'Deep Sea Divers'
          },
          {
            id: '317SP',
            name: 'Harp Brewery'
          },
          {
            id: '420HI',
            name: 'Joe'
          },
          {
            id: '1138GL',
            name: 'THX Sound Enterprises'
          }
        ]);
      });

      describe('toggling the scheduled flag', () => {
        it('sets the dates to the task dates when true', () => {
          editor.schedule = false;
          editor.scheduleChanged();
          editor.schedule = true;
          editor.scheduleChanged();
          expect(editor.beginDate).toEqual('2019-01-15');
          expect(editor.endDate).toEqual('2019-01-18');
        });

        it('clears the dates when false', () => {
          editor.schedule = false;
          editor.scheduleChanged();
          expect(editor.beginDate).toBeFalsy();
          expect(editor.endDate).toBeFalsy();
        });
      });

      describe('changing the begin date', () => {
        it('moves the end date to match', () => {
          editor.beginDate = '2019-06-03';
          editor.beginDateChanged();
          expect(editor.endDate).toEqual('2019-06-06');
        });

        it('keeps the gap when the end date changes', () => {
          editor.endDate = '2019-01-20';
          editor.endDateChanged();
          editor.beginDate = '2019-06-03';
          editor.beginDateChanged();
          expect(editor.endDate).toEqual('2019-06-08');
        });
      });

      describe('save', () => {
        it('updates the task', () => {
          const tasks = TestBed.get(TasksService);
          editor.name = 'Bi-Weekly Status Meeting';
          editor.description = 'Moving to twice a week';
          editor.save();
          expect(tasks.update).toHaveBeenCalledTimes(1);
        });

        it('passes the id, name, description, and isActive status', () => {
          const tasks = TestBed.get(TasksService);
          editor.name = 'Bi-Weekly Status Meeting';
          editor.description = 'Moving to twice a week';
          editor.save();
          expect(tasks.update).toHaveBeenCalledWith({
            id: '88395AA930FE',
            name: 'Bi-Weekly Status Meeting',
            description: 'Moving to twice a week',
            status: Statuses.Repeating,
            priority: Priorities.Low,
            type: TaskTypes.Meeting,
            beginDate: '2019-01-15',
            endDate: '2019-01-18',
            customerId: '1138GL',
            customerName: 'THX Sound Enterprises',
            enteredOn: new firestore.Timestamp(1545765815, 0)
          });
        });

        it('dismisses the modal', () => {
          const modal = TestBed.get(ModalController);
          editor.save();
          expect(modal.dismiss).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('in update mode with inactive customer', () => {
    beforeEach(() => {
      editor.task = {
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.Repeating,
        priority: Priorities.Low,
        type: TaskTypes.Meeting,
        beginDate: '2019-01-15',
        endDate: '2019-01-18',
        customerId: '73SC',
        customerName: 'Wheels',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      };
      fixture.detectChanges();
    });

    it('maps the active customers and the assigned customer', () => {
      expect(editor.activeCustomers).toEqual([
        {
          id: '705AMS',
          name: 'Ashley Furniture'
        },
        {
          id: '42DA',
          name: 'Deep Sea Divers'
        },
        {
          id: '317SP',
          name: 'Harp Brewery'
        },
        {
          id: '420HI',
          name: 'Joe'
        },
        {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        },
        {
          id: '73SC',
          name: 'Wheels'
        }
      ]);
    });
  });
});
