import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoteEditorComponent } from '@app/editors';
import { Note } from '@app/models';
import { NotesService } from '@app/services/firestore-data';
import { createNotesServiceMock } from '@app/services/firestore-data/mocks';
import { AlertController, ModalController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock, fakeTimestamp } from '@test/mocks';
import { of } from 'rxjs';
import { NotesListComponent } from './notes-list.component';

describe('NotesListComponent', () => {
  let alert: any;
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      alert = createOverlayElementMock();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [NotesListComponent],
        providers: [
          {
            provide: AlertController,
            useFactory: () => createOverlayControllerMock(alert),
          },
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
          { provide: NotesService, useFactory: createNotesServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('gets the list of notes', () => {
    const notes = TestBed.inject(NotesService);
    component.itemId = '314159PI';
    fixture.detectChanges();
    expect(notes.allFor).toHaveBeenCalledTimes(1);
    expect(notes.allFor).toHaveBeenCalledWith('314159PI');
  });

  it('assigns the returned notes', () => {
    const notes = TestBed.inject(NotesService);
    const n: Array<Note> = [
      {
        id: '42995849',
        text: 'this is note #1',
        enteredOn: fakeTimestamp(14123409350),
        itemId: '314159PI',
      },
      {
        id: 'akfkig92034',
        text: 'this is note #2',
        enteredOn: fakeTimestamp(14129340059),
        itemId: '314159PI',
      },
      {
        id: 'zzdf9249',
        text: 'this is note #3',
        enteredOn: fakeTimestamp(14994409350),
        itemId: '314159PI',
      },
    ];
    (notes.allFor as jest.Mock).mockReturnValue(of(n));
    fixture.detectChanges();
    expect(component.allNotes).toEqual(n);
  });

  describe('add', () => {
    beforeEach(() => {
      component.itemId = '4273';
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the current task ID', () => {
      const modalController = TestBed.inject(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: NoteEditorComponent,
        componentProps: { itemId: '4273' },
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

    const note: Note = {
      id: '42DA',
      text: 'First find Deep Thought, then get the answer from it',
      enteredOn: fakeTimestamp(14324053),
      itemId: '451BK',
    };

    it('creates an alert', () => {
      const alertController = TestBed.inject(AlertController);
      component.delete(note);
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    it('presents the alert', async () => {
      await component.delete(note);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete on "Yes"', () => {
      const alertController = TestBed.inject(AlertController);
      const notes = TestBed.inject(NotesService);
      component.notesList = { closeSlidingItems: jest.fn() } as any;
      component.delete(note);
      const button = (alertController.create as jest.Mock).mock.calls[0][0].buttons[0];
      button.handler();
      expect(notes.delete).toHaveBeenCalledTimes(1);
    });

    it('closes the sliding items on "Yes"', () => {
      const alertController = TestBed.inject(AlertController);
      component.notesList = { closeSlidingItems: jest.fn() } as any;
      component.delete(note);
      const button = (alertController.create as jest.Mock).mock.calls[0][0].buttons[0];
      button.handler();
      expect(component.notesList.closeSlidingItems).toHaveBeenCalledTimes(1);
    });

    it('does not delete on "No"', () => {
      const alertController = TestBed.inject(AlertController);
      component.delete(note);
      const button = (alertController.create as jest.Mock).mock.calls[0][0].buttons[1];
      expect(button.role).toEqual('cancel');
      expect(button.handler).toBeUndefined();
    });
  });

  describe('view', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: fakeTimestamp(1432430034),
      });
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the notes editor component and passes the note to view', () => {
      const modalController = TestBed.inject(ModalController);
      component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: fakeTimestamp(1432430034),
      });
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: NoteEditorComponent,
        componentProps: {
          note: {
            id: '4277785',
            text: 'this is just a test note, nothing more',
            itemId: '314159PI',
            enteredOn: fakeTimestamp(1432430034),
          },
        },
      });
    });

    it('presents the modal', async () => {
      await component.view({
        id: '4277785',
        text: 'this is just a test note, nothing more',
        itemId: '314159PI',
        enteredOn: fakeTimestamp(1432430034),
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
