import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TasksService } from '@app/services/firestore-data';
import { createTasksServiceMock } from '@app/services/firestore-data/mocks';
import { ProjectState } from '@app/store/reducers/project/project.reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { initializeTestProjects, testProjectIds, testProjects } from '@test/data';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { TaskEditorComponent } from './task-editor.component';

describe('TaskEditorComponent', () => {
  let editor: TaskEditorComponent;
  let fixture: ComponentFixture<TaskEditorComponent>;

  beforeEach(
    waitForAsync(() => {
      initializeTestProjects();
      TestBed.configureTestingModule({
        declarations: [TaskEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(createOverlayElementMock()),
          },
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
    fixture = TestBed.createComponent(TaskEditorComponent);
    editor = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(editor).toBeTruthy();
  });

  it('calculates a max due date', () => {
    const now = Date.now;
    Date.now = jest.fn(() => new Date('2018-12-25T14:23:35.000-05:00').getTime());
    fixture.detectChanges();
    expect(editor.maxDate).toEqual('2021-12-25');
    Date.now = now;
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      const modal = TestBed.inject(ModalController);
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    let now;
    beforeEach(() => {
      now = Date.now;
      Date.now = jest.fn(() => new Date('2018-12-25T14:23:35.000-05:00').getTime());
      fixture.detectChanges();
    });

    afterEach(() => (Date.now = now));

    it('sets the title to "Add New Task"', () => {
      expect(editor.title).toEqual('Add New Task');
    });

    it('defaults the status to Open', () => {
      expect(editor.status).toEqual(Statuses.open);
    });

    it('defaults the type to Follow-up', () => {
      expect(editor.taskType).toEqual(TaskTypes.feature);
    });

    it('defaults the priority to Normal', () => {
      expect(editor.priority).toEqual(Priorities.normal);
    });

    it('defaults to not scheduling the task', () => {
      expect(editor.schedule).toBeFalsy();
      expect(editor.beginDate).toBeFalsy();
      expect(editor.endDate).toBeFalsy();
    });

    it('maps the active projects', () => {
      expect(editor.activeProjects).toEqual([
        {
          id: 'fiig9488593',
          name: 'Cow',
        },
        {
          id: 'b99f03590do',
          name: 'Figmo',
        },
        {
          id: 'a19943kkg039',
          name: 'Gizmo',
        },
        {
          id: 'iriit003499340',
          name: 'Personal Task Timer',
        },
        {
          id: 'ri49950399vf',
          name: 'Project Task List',
        },
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
        Date.now = jest.fn(() => new Date('2018-12-25T14:23:35.000-05:00').getTime());
      });

      it('adds the task', () => {
        const tasks = TestBed.inject(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.projectId = 'iriit003499340';
        editor.save();
        expect(tasks.add).toHaveBeenCalledTimes(1);
      });

      it('passes the data', () => {
        const tasks = TestBed.inject(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.projectId = 'iriit003499340';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.open,
          type: TaskTypes.feature,
          priority: Priorities.normal,
          projectId: 'iriit003499340',
          projectName: 'Personal Task Timer',
          enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
        });
      });

      it('passes the begin and end dates if they exist', () => {
        const tasks = TestBed.inject(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.projectId = 'iriit003499340';
        editor.beginDate = '2019-01-03';
        editor.endDate = '2019-01-04';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.open,
          type: TaskTypes.feature,
          priority: Priorities.normal,
          projectId: 'iriit003499340',
          projectName: 'Personal Task Timer',
          enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
          beginDate: '2019-01-03',
          endDate: '2019-01-04',
        });
      });

      it('has a blank project name if the project cannot be found', () => {
        const tasks = TestBed.inject(TasksService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.projectId = '1139GL';
        editor.save();
        expect(tasks.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          status: Statuses.open,
          type: TaskTypes.feature,
          priority: Priorities.normal,
          projectId: '1139GL',
          projectName: undefined,
          enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
        });
      });

      it('dismisses the modal', () => {
        const modal = TestBed.inject(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('in update mode', () => {
    let now;
    beforeEach(() => {
      now = Date.now;
      Date.now = jest.fn(() => new Date('2019-03-13T12:05:45.000-05:00').getTime());
    });

    afterEach(() => (Date.now = now));

    describe('without schedule dates', () => {
      beforeEach(() => {
        editor.task = {
          id: '88395AA930FE',
          name: 'Weekly Status Meeting',
          description: 'Weekly status meeting, usually on Thursdays',
          status: Statuses.open,
          priority: Priorities.low,
          type: TaskTypes.task,
          projectId: 'iriit003499340',
          projectName: 'Personal Task Timer',
          enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
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
          status: Statuses.open,
          priority: Priorities.low,
          type: TaskTypes.task,
          beginDate: '2019-01-15',
          endDate: '2019-01-18',
          projectId: 'iriit003499340',
          projectName: 'Personal Task Timer',
          enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
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
        expect(editor.description).toEqual('Weekly status meeting, usually on Thursdays');
      });

      it('initializes the status', () => {
        expect(editor.status).toEqual(Statuses.open);
      });

      it('initializes the task type', () => {
        expect(editor.taskType).toEqual(TaskTypes.task);
      });

      it('initializes the priority', () => {
        expect(editor.priority).toEqual(Priorities.low);
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

      it('initializes the project ID', () => {
        expect(editor.projectId).toEqual('iriit003499340');
      });

      it('maps the active projects', () => {
        expect(editor.activeProjects).toEqual([
          {
            id: 'fiig9488593',
            name: 'Cow',
          },
          {
            id: 'b99f03590do',
            name: 'Figmo',
          },
          {
            id: 'a19943kkg039',
            name: 'Gizmo',
          },
          {
            id: 'iriit003499340',
            name: 'Personal Task Timer',
          },
          {
            id: 'ri49950399vf',
            name: 'Project Task List',
          },
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
          const tasks = TestBed.inject(TasksService);
          editor.name = 'Bi-Weekly Status Meeting';
          editor.description = 'Moving to twice a week';
          editor.save();
          expect(tasks.update).toHaveBeenCalledTimes(1);
        });

        it('passes the id, name, description, and isActive status', () => {
          const tasks = TestBed.inject(TasksService);
          editor.name = 'Bi-Weekly Status Meeting';
          editor.description = 'Moving to twice a week';
          editor.save();
          expect(tasks.update).toHaveBeenCalledWith({
            id: '88395AA930FE',
            name: 'Bi-Weekly Status Meeting',
            description: 'Moving to twice a week',
            status: Statuses.open,
            priority: Priorities.low,
            type: TaskTypes.task,
            beginDate: '2019-01-15',
            endDate: '2019-01-18',
            projectId: 'iriit003499340',
            projectName: 'Personal Task Timer',
            enteredOn: { seconds: 1545765815, nanoseconds: 0 },
          });
        });

        it('dismisses the modal', () => {
          const modal = TestBed.inject(ModalController);
          editor.save();
          expect(modal.dismiss).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('in update mode with inactive project', () => {
    beforeEach(() => {
      editor.task = {
        id: '88395AA930FE',
        name: 'Weekly Status Meeting',
        description: 'Weekly status meeting, usually on Thursdays',
        status: Statuses.open,
        priority: Priorities.low,
        type: TaskTypes.task,
        beginDate: '2019-01-15',
        endDate: '2019-01-18',
        projectId: 'aa9300kfii593',
        projectName: 'Math War',
        enteredOn: { seconds: 1545765815, nanoseconds: 0 } as any,
      };
      fixture.detectChanges();
    });

    it('maps the active projects and the assigned project', () => {
      expect(editor.activeProjects).toEqual([
        {
          id: 'fiig9488593',
          name: 'Cow',
        },
        {
          id: 'b99f03590do',
          name: 'Figmo',
        },
        {
          id: 'a19943kkg039',
          name: 'Gizmo',
        },
        {
          id: 'aa9300kfii593',
          name: 'Math War',
        },
        {
          id: 'iriit003499340',
          name: 'Personal Task Timer',
        },
        {
          id: 'ri49950399vf',
          name: 'Project Task List',
        },
      ]);
    });
  });
});
