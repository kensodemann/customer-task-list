import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';
import { ApplicationService } from '@app/services';
import { createApplicationServiceMock } from '@app/services/mocks';

describe('TabsPage', () => {
  let page: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let application;

  beforeEach(async(() => {
    application = createApplicationServiceMock();
    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ApplicationService, useValue: application }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });
});
