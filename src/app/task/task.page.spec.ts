import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { NoteEditorComponent } from '../editors/note-editor/note-editor.component';
import { NotesService } from '../services/notes/notes.service';
import { NoteWithId } from '../models/note';
import { Priorities, Statuses, TaskTypes } from '../default-data';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';
import { TaskPage } from './task.page';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

import {
  createActivatedRouteMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';
import { createNotesServiceMock } from '../services/notes/notes.mock';
import { createTasksServiceMock } from '../services/tasks/tasks.mock';

describe('TaskPage', () => {
  let alert;
  let alertController;
  let page: TaskPage;
  let fixture: ComponentFixture<TaskPage>;
  let modal;
  let modalController;
  let notes;
  let route;
  let tasks;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    notes = createNotesServiceMock();
    route = createActivatedRouteMock();
    tasks = createTasksServiceMock();
    TestBed.configureTestingModule({
      declarations: [TaskPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: AlertController, useValue: alertController },
        { provide: ModalController, useValue: modalController },
        { provide: NotesService, useValue: notes },
        { provide: TasksService, useValue: tasks }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPage);
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

  it('get the task for the id', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(tasks.get).toHaveBeenCalledTimes(1);
    expect(tasks.get).toHaveBeenCalledWith('314159PI');
  });

  it('gets the notes for the task', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    fixture.detectChanges();
    expect(notes.allFor).toHaveBeenCalledTimes(1);
    expect(notes.allFor).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the customer', () => {
    route.snapshot.paramMap.get.and.returnValue('314159PI');
    tasks.get.and.returnValue(
      of({
        id: '314159PI',
        name: 'Bang the Big',
        description: 'Just like it sounds there captain',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
        type: TaskTypes.Meeting,
        status: Statuses.Open,
        priority: Priorities.Normal,
        customerId: '451BK',
        customerName: 'Book Burners R Us'
      })
    );
    fixture.detectChanges();
    expect(page.task).toEqual({
      id: '314159PI',
      name: 'Bang the Big',
      description: 'Just like it sounds there captain',
      enteredOn: { nanoseconds: 0, seconds: 1432430034053 },
      type: TaskTypes.Meeting,
      status: Statuses.Open,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    });
  });

  describe('edit task', () => {
    const task: TaskWithId = {
      id: '314159PI',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      type: TaskTypes.FollowUp,
      status: Statuses.Closed,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('314159PI');
      tasks.get.and.returnValue(of(task));
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      page.edit();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the task editor component and passes the current task', () => {
      page.edit();
      expect(modalController.create).toHaveBeenCalledWith({
        component: TaskEditorComponent,
        componentProps: { task: task }
      });
    });

    it('presents the modal', async () => {
      await page.edit();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    const note: NoteWithId = {
      id: '42DA',
      text: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      itemId: '451BK'
    };

    it('creates an alert', () => {
      page.deleteNote(note);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await page.deleteNote(note);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      page.deleteNote(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(notes.delete).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      page.deleteNote(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });

  describe('add note', () => {
    const task: TaskWithId = {
      id: '314159PI',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      type: TaskTypes.FollowUp,
      status: Statuses.Closed,
      priority: Priorities.Normal,
      customerId: '451BK',
      customerName: 'Book Burners R Us'
    };

    beforeEach(() => {
      route.snapshot.paramMap.get.and.returnValue('314159PI');
      tasks.get.and.returnValue(of(task));
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
        componentProps: { itemId: task.id }
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
});
