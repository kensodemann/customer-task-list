import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPage } from './tasks.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';

describe('TasksPage', () => {
  let authentication;
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    TestBed.configureTestingModule({
      declarations: [TasksPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: AuthenticationService, useValue: authentication }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
