import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPage } from './customers.page';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
