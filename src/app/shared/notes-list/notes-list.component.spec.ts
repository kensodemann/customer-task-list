import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { NoteEditorComponent } from '../../editors/note-editor/note-editor.component';
import { NotesListComponent } from './notes-list.component';
import { NotesService } from '../../services/firestore-data/notes/notes.service';

import { createNotesServiceMock } from '../../services/firestore-data/notes/notes.mock';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../../test/mocks';
import { NoteWithId } from 'src/app/models/note';

describe('NotesListComponent', () => {
  let alert;
  let alertController;
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  let modal;
  let modalController;
  let notes;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    notes = createNotesServiceMock();
    TestBed.configureTestingModule({
      declarations: [NotesListComponent],
      providers: [
        { provide: AlertController, useValue: alertController },
        { provide: ModalController, useValue: modalController },
        { provide: NotesService, useValue: notes }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('gets the list of notes', () => {
    component.itemId = '314159PI';
    fixture.detectChanges();
    expect(notes.allFor).toHaveBeenCalledTimes(1);
    expect(notes.allFor).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the returned notes', () => {
    const n: Array<NoteWithId> = [
      {
        id: '42995849',
        text: 'this is note #1',
        enteredOn: { seconds: 14123409350, nanoseconds: 0 },
        itemId: '314159PI'
      },
      {
        id: 'akfkig92034',
        text: 'this is note #2',
        enteredOn: { seconds: 14129340059, nanoseconds: 0 },
        itemId: '314159PI'
      },
      {
        id: 'zzdf9249',
        text: 'this is note #3',
        enteredOn: { seconds: 14994409350, nanoseconds: 0 },
        itemId: '314159PI'
      }
    ];
    notes.allFor.and.returnValue(of(n));
    fixture.detectChanges();
    expect(component.allNotes).toEqual(n);
  });

  describe('add', () => {
    beforeEach(() => {
      component.itemId = '4273';
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the current task ID', () => {
      component.add();
      expect(modalController.create).toHaveBeenCalledWith({
        component: NoteEditorComponent,
        componentProps: { itemId: '4273' }
      });
    });

    it('presents the modal', async () => {
      await component.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
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
      component.delete(note);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await component.delete(note);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      component.notesList = jasmine.createSpyObj('IonList', [
        'closeSlidingItems'
      ]);
      component.delete(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(notes.delete).toHaveBeenCalledTimes(1);
    });

    it('closes the sliding items on "Yes"', () => {
      component.notesList = jasmine.createSpyObj('IonList', [
        'closeSlidingItems'
      ]);
      component.delete(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(component.notesList.closeSlidingItems).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      component.delete(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });

  describe('view', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
      });
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the note to view', () => {
      component.view({
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
      await component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: { nanoseconds: 0, seconds: 1432430034053 }
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
