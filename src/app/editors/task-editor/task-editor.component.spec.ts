import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { firestore } from 'firebase/app';

import { CustomerWithId } from '../../models/customer';
import { CustomersService } from '../../services/customers/customers.service';
import { TaskEditorComponent } from './task-editor.component';
import { TasksService } from '../../services/tasks/tasks.service';

import {
  createOverlayControllerMock,
  createOverlayElementMock
} from 'test/mocks';
import { createCustomersServiceMock } from '../../services/customers/customers.mock';
import { createTasksServiceMock } from '../../services/tasks/tasks.mock';

describe('TaskEditorComponent', () => {
  let allCustomers: Array<CustomerWithId>;
  let component: TaskEditorComponent;
  let customers;
  let fixture: ComponentFixture<TaskEditorComponent>;
  let modal;
  let tasks;

  beforeEach(async(() => {
    customers = createCustomersServiceMock();
    modal = createOverlayControllerMock(
      'ModalController',
      createOverlayElementMock('Modal')
    );
    tasks = createTasksServiceMock();
    TestBed.configureTestingModule({
      declarations: [TaskEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: CustomersService, useValue: customers },
        { provide: ModalController, useValue: modal },
        { provide: TasksService, useValue: tasks }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
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
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      fixture.detectChanges();
      component.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('defaults the status to Open', () => {
      expect(component.status).toEqual('Open');
    });

    it('defaults the type to Follow-up', () => {
      expect(component.taskType).toEqual('Follow-up');
    });

    it('defaults the priority to Normal', () => {
      expect(component.priority).toEqual('Normal');
    });

    it('gets the customers', () => {
      expect(customers.all).toHaveBeenCalledTimes(1);
    });

    it('maps the active customers', () => {
      expect(component.activeCustomers).toEqual([
        {
          id: '420HI',
          name: 'Joe'
        },
        {
          id: '42DA',
          name: 'Deep Sea Divers'
        },
        {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        },
        {
          id: '705AMS',
          name: 'Ashley Furniture'
        },
        {
          id: '317SP',
          name: 'Harp Brewery'
        }
      ]);
    });

    describe('save', () => {
      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date('2018-12-25T14:23:35.000-05:00'));
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('adds the task', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.customerId = '1138GL';
        component.save();
        expect(tasks.add).toHaveBeenCalledTimes(1);
      });

      it('passes the data', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.customerId = '1138GL';
        component.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: 'Open',
          type: 'Follow-up',
          priority: 'Normal',
          customer: {
            id: '1138GL',
            name: 'THX Sound Enterprises'
          },
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('passes the due date if there is one', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.customerId = '1138GL';
        component.dueDate = '2019-01-03';
        component.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: 'Open',
          type: 'Follow-up',
          priority: 'Normal',
          customer: {
            id: '1138GL',
            name: 'THX Sound Enterprises'
          },
          enteredOn: new firestore.Timestamp(1545765815, 0),
          dueDate: '2019-01-03'
        });
      });

      it('has a blank customer name if the customer cannot be found', () => {
        component.name = 'The Dude';
        component.description = 'He does abide';
        component.customerId = '1139GL';
        component.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: 'Open',
          type: 'Follow-up',
          priority: 'Normal',
          customer: {
            id: '1139GL',
            name: undefined
          },
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('dismisses the modal', async () => {
        await component.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('in update mode', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2019-03-13T12:05:45.000-05:00'));
      component.task = {
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: 'Repeating',
        priority: 'Low',
        type: 'Meeting',
        dueDate: '2019-01-15',
        customer: {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        },
        enteredOn: new firestore.Timestamp(1545765815, 0)
      };
      fixture.detectChanges();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('initializes the name', () => {
      expect(component.name).toEqual('Weekly Status Meeting');
    });

    it('initializes the description', () => {
      expect(component.description).toEqual(
        'Weekly status meeting, usually on Thursdays'
      );
    });

    it('initializes the status', () => {
      expect(component.status).toEqual('Repeating');
    });

    it('initializes the task type', () => {
      expect(component.taskType).toEqual('Meeting');
    });

    it('initializes the priority', () => {
      expect(component.priority).toEqual('Low');
    });

    it('initializes the due date', () => {
      expect(component.dueDate).toEqual('2019-01-15');
    });

    it('initializes the customer ID', () => {
      expect(component.customerId).toEqual('1138GL');
    });

    it('gets the customers', () => {
      expect(customers.all).toHaveBeenCalledTimes(1);
    });

    it('maps the active customers', () => {
      expect(component.activeCustomers).toEqual([
        {
          id: '420HI',
          name: 'Joe'
        },
        {
          id: '42DA',
          name: 'Deep Sea Divers'
        },
        {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        },
        {
          id: '705AMS',
          name: 'Ashley Furniture'
        },
        {
          id: '317SP',
          name: 'Harp Brewery'
        }
      ]);
    });

    describe('save', () => {
      it('updates the task', () => {
        component.name = 'Bi-Weekly Status Meeting';
        component.description = 'Moving to twice a week';
        component.save();
        expect(tasks.update).toHaveBeenCalledTimes(1);
      });

      it('passes the id, name, description, and isActive status', () => {
        component.name = 'Bi-Weekly Status Meeting';
        component.description = 'Moving to twice a week';
        component.save();
        expect(tasks.update).toHaveBeenCalledWith({
          id: '88395AA930FE',
          name: 'Bi-Weekly Status Meeting',
          description: 'Moving to twice a week',
          status: 'Repeating',
          priority: 'Low',
          type: 'Meeting',
          dueDate: '2019-01-15',
          customer: {
            id: '1138GL',
            name: 'THX Sound Enterprises'
          },
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('dismisses the modal', async () => {
        await component.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('in update mode with inactive customer', () => {
    beforeEach(() => {
      component.task = {
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: 'Repeating',
        priority: 'Low',
        type: 'Meeting',
        dueDate: '2019-01-15',
        customer: {
          id: '73SC',
          name: 'Wheels'
        },
        enteredOn: new firestore.Timestamp(1545765815, 0)
      };
      fixture.detectChanges();
    });

    it('maps the active customers and the assigned customer', () => {
      expect(component.activeCustomers).toEqual([
        {
          id: '420HI',
          name: 'Joe'
        },
        {
          id: '73SC',
          name: 'Wheels'
        },
        {
          id: '42DA',
          name: 'Deep Sea Divers'
        },
        {
          id: '1138GL',
          name: 'THX Sound Enterprises'
        },
        {
          id: '705AMS',
          name: 'Ashley Furniture'
        },
        {
          id: '317SP',
          name: 'Harp Brewery'
        }
      ]);
    });
  });
});
