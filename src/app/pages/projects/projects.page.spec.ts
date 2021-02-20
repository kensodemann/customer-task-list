import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ProjectsPage } from './projects.page';
import { Project } from '@app/models';
import { logout } from '@app/store/actions/auth.actions';

import { ProjectEditorComponent } from '@app/editors';
import { createNavControllerMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { testProjects, testProjectIds, initializeTestProjects } from '@test/data';
import { ProjectState } from '@app/store/reducers/project/project.reducer';

describe('ProjectsPage', () => {
  let list: Array<Project>;
  let modal;
  let page: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;

  beforeEach(async(() => {
    initializeTestProjects();
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [ProjectsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(modal),
        },
        { provide: NavController, useFactory: createNavControllerMock },
        provideMockStore<{ projects: ProjectState }>({
          initialState: { projects: { loading: false, ids: testProjectIds, entities: testProjects } },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    list = [
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: false,
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true,
      },
    ];
    fixture = TestBed.createComponent(ProjectsPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  describe('add project', () => {
    it('creates a modal', () => {
      const modalController = TestBed.get(ModalController);
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component', () => {
      const modalController = TestBed.get(ModalController);
      page.add();
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: ProjectEditorComponent,
      });
    });

    it('presents the modal', async () => {
      await page.add();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('view project', () => {
    it('navigates to the project', () => {
      const navController = TestBed.get(NavController);
      page.view({
        id: '4273',
        name: 'Dominos',
        description: 'Pizza apps that rock, the pizza not so much',
        isActive: true,
      });
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith(['tabs', 'projects', '4273']);
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      page.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
