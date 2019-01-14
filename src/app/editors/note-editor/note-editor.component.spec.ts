import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { firestore } from 'firebase/app';

import { NoteEditorComponent } from './note-editor.component';
import { NotesService } from '../../services/firestore-data/notes/notes.service';

import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../../test/mocks';
import { createNotesServiceMock } from '../../services/firestore-data/notes/notes.mock';

describe('NoteEditorComponent', () => {
  let editor: NoteEditorComponent;
  let fixture: ComponentFixture<NoteEditorComponent>;
  let modal;
  let notes;

  beforeEach(async(() => {
    modal = createOverlayControllerMock(
      'ModalController',
      createOverlayElementMock('Modal')
    );
    notes = createNotesServiceMock();
    TestBed.configureTestingModule({
      declarations: [NoteEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ModalController, useValue: modal },
        { provide: NotesService, useValue: notes }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteEditorComponent);
    editor = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(editor).toBeTruthy();
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2018-12-25T14:23:35.000-05:00'));
      editor.itemId = '39945akf953';
      fixture.detectChanges();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Add New Note');
    });

    describe('save', () => {
      it('adds the note', () => {
        editor.text = 'The dude, he does abide';
        editor.save();
        expect(notes.add).toHaveBeenCalledTimes(1);
      });

      it('passes the text, enteredOn timestamp, and item ID', () => {
        editor.text = 'The dude, he does abide';
        editor.save();
        expect(notes.add).toHaveBeenCalledWith({
          text: 'The dude, he does abide',
          itemId: '39945akf953',
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('dismisses the modal', () => {
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      editor.note = {
        id: '531LLS',
        text: 'I have no idea what that would be',
        itemId: '420STNR',
        enteredOn: new firestore.Timestamp(1545765815, 0)
      };
      fixture.detectChanges();
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Note');
    });

    it('initializes the text', () => {
      expect(editor.text).toEqual('I have no idea what that would be');
    });

    it('leaves the itemId undefined', () => {
      expect(editor.itemId).toBeUndefined();
    });

    describe('save', () => {
      it('updates the node', () => {
        editor.text = 'The Dude, he does abide';
        editor.save();
        expect(notes.update).toHaveBeenCalledTimes(1);
      });

      it('passes text', () => {
        editor.text = 'The Dude, he does abide';
        editor.save();
        expect(notes.update).toHaveBeenCalledWith({
          id: '531LLS',
          text: 'The Dude, he does abide',
          itemId: '420STNR',
          enteredOn: new firestore.Timestamp(1545765815, 0)
        });
      });

      it('dismisses the modal', () => {
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });
});
