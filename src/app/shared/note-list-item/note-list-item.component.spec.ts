import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteListItemComponent } from './note-list-item.component';

describe('NoteListItemComponent', () => {
  let component: NoteListItemComponent;
  let fixture: ComponentFixture<NoteListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteListItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteListItemComponent);
    component = fixture.componentInstance;
    component.note = {
      id: '42DA',
      text: 'First find Deep Thought, then get the answer from it',
      enteredOn: { nanoseconds: 0, seconds: 14324053 },
      itemId: '451BK'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('noteText', () => {
    it('returns the text of the note', () => {
      expect(component.noteText).toEqual(component.note.text);
    });

    it('returns the text of the note up to 160 characters', () => {
      component.note.text =
        'Lorem ipsum dolor sit amet, ut utroque probatus dignissim mei, ' +
        'et est oblique alienum antiopam, has ut partiendo dissentiunt.Eu has quando graeco aperiam, vimus';
      expect(component.noteText).toEqual(component.note.text);
    });

    it('truncates longer text at 160 characters', () => {
      component.note.text =
        'Lorem ipsum dolor sit amet, ut utroque probatus dignissim mei, ' +
        'et est oblique alienum antiopam, has ut partiendo dissentiunt.Eu has quando graeco aperiam, vimus noluisse forensibus';
      expect(component.noteText.length).toEqual(160);
      expect(component.noteText).toEqual(
        'Lorem ipsum dolor sit amet, ut utroque probatus dignissim mei, ' +
        'et est oblique alienum antiopam, has ut partiendo dissentiunt.Eu has quando graeco aperiam, vi...');
    });
  });
});
