import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, ModalController } from '@ionic/angular';
import { firestore } from 'firebase/app';
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
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  let modal;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [NotesListComponent],
      providers: [
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
        { provide: NotesService, useFactory: createNotesServiceMock }
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
    const notes = TestBed.get(NotesService);
    component.itemId = '314159PI';
    fixture.detectChanges();
    expect(notes.allFor).toHaveBeenCalledTimes(1);
    expect(notes.allFor).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the returned notes', () => {
    const notes = TestBed.get(NotesService);
    const n: Array<NoteWithId> = [
      {
        id: '42995849',
        text: 'this is note #1',
        enteredOn: new firestore.Timestamp(14123409350, 0),
        itemId: '314159PI'
      },
      {
        id: 'akfkig92034',
        text: 'this is note #2',
        enteredOn: new firestore.Timestamp(14129340059, 0),
        itemId: '314159PI'
      },
      {
        id: 'zzdf9249',
        text: 'this is note #3',
        enteredOn: new firestore.Timestamp(14994409350, 0),
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
      const modalController = TestBed.get(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the current task ID', () => {
      const modalController = TestBed.get(ModalController);
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
      enteredOn: new firestore.Timestamp(14324053, 0),
      itemId: '451BK'
    };

    it('creates an alert', () => {
      const alertController = TestBed.get(AlertController);
      component.delete(note);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await component.delete(note);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      const alertController = TestBed.get(AlertController);
      const notes = TestBed.get(NotesService);
      component.notesList = jasmine.createSpyObj('IonList', [
        'closeSlidingItems'
      ]);
      component.delete(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(notes.delete).toHaveBeenCalledTimes(1);
    });

    it('closes the sliding items on "Yes"', () => {
      const alertController = TestBed.get(AlertController);
      component.notesList = jasmine.createSpyObj('IonList', [
        'closeSlidingItems'
      ]);
      component.delete(note);
      const button = alertController.create.calls.argsFor(0)[0].buttons[0];
      button.handler();
      expect(component.notesList.closeSlidingItems).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      const alertController = TestBed.get(AlertController);
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
      const modalController = TestBed.get(ModalController);
      component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: new firestore.Timestamp(1432430034, 0)
      });
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the note to view', () => {
      const modalController = TestBed.get(ModalController);
      component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: new firestore.Timestamp(1432430034, 0)
      });
      expect(modalController.create).toHaveBeenCalledWith({
        component: NoteEditorComponent,
        componentProps: {
          note: {
            id: '4277785',
            text: 'this is just a test note, nothing more',
            itemId: '314159PI',
            enteredOn: new firestore.Timestamp(1432430034, 0)
          }
        }
      });
    });

    it('presents the modal', async () => {
      await component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: new firestore.Timestamp(1432430034, 0)
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
