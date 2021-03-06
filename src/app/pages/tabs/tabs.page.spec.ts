import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApplicationService } from '@app/services';
import { createApplicationServiceMock } from '@app/services/mocks';
import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let page: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let application: any;

  beforeEach(
    waitForAsync(() => {
      application = createApplicationServiceMock();
      TestBed.configureTestingModule({
        declarations: [TabsPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: ApplicationService, useValue: application }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });
});
