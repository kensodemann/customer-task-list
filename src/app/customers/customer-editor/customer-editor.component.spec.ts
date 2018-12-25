import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { CustomerEditorComponent } from './customer-editor.component';

import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../../test/mocks';

describe('CustomerEditorComponent', () => {
  let component: CustomerEditorComponent;
  let fixture: ComponentFixture<CustomerEditorComponent>;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayControllerMock(
      'ModalController',
      createOverlayElementMock('Modal')
    );
    TestBed.configureTestingModule({
      declarations: [CustomerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [{ provide: ModalController, useValue: modal }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      component.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('dismisses the modal', () => {
      component.save();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
