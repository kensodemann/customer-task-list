import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

import { ProjectsPage } from './projects.page';
import { ProjectsService } from '@app/services/firestore-data';
import { createProjectsServiceMock } from '@app/services/firestore-data/mocks';
import { Project } from '@app/models';
import { logout } from '@app/store/actions/auth.actions';

import { ProjectEditorComponent } from '@app/editors';
import { createNavControllerMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';

describe('ProjectsPage', () => {
  let projectList: Subject<Array<Project>>;
  let list: Array<Project>;
  let modal;
  let page: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;

  beforeEach(async(() => {
    projectList = new Subject();
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [ProjectsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ProjectsService, useFactory: createProjectsServiceMock },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(modal)
        },
        { provide: NavController, useFactory: createNavControllerMock },
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const projects = TestBed.get(ProjectsService);
    projects.all.mockReturnValue(projectList);
    list = [
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: false
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      }
    ];
    fixture = TestBed.createComponent(ProjectsPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  it('sets up an observable on the projects', () => {
    const projects = TestBed.get(ProjectsService);
    expect(projects.all).toHaveBeenCalledTimes(1);
  });

  it('sets all projects on changes to the projects', () => {
    projectList.next(list);
    expect(page.allProjects).toEqual(list);
  });

  it('sorts the projects by name', () => {
    projectList.next([
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      },
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: true
      },
      {
        id: '3895WUT',
        name: `Hello Underdog`,
        description: 'Underwear for your pooch',
        isActive: true
      },
      {
        id: '12345',
        name: `aa bus lines`,
        description: 'The best bus line for your apparently lacking money',
        isActive: true
      }
    ]);
    expect(page.allProjects).toEqual([
      {
        id: '12345',
        name: `aa bus lines`,
        description: 'The best bus line for your apparently lacking money',
        isActive: true
      },
      {
        id: '314PI',
        name: `Baker's Square`,
        description: 'Makers of overly sweet pies and otherwise crappy food',
        isActive: true
      },
      {
        id: '3895WUT',
        name: `Hello Underdog`,
        description: 'Underwear for your pooch',
        isActive: true
      },
      {
        id: '420HI',
        name: 'Joe',
        description: 'Some guy named Joe who sells weed on my street corner',
        isActive: true
      }
    ]);
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
        component: ProjectEditorComponent
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
        isActive: true
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
