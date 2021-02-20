import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProjectEditorComponent } from '@app/editors';
import { logout } from '@app/store/actions/auth.actions';
import { ProjectState } from '@app/store/reducers/project/project.reducer';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initializeTestProjects, testProjectIds, testProjects } from '@test/data';
import { createNavControllerMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { ProjectsPage } from './projects.page';

describe('ProjectsPage', () => {
  let modal: any;
  let page: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  describe('add project', () => {
    it('creates a modal', () => {
      const modalController = TestBed.inject(ModalController);
      page.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('uses the correct component', () => {
      const modalController = TestBed.inject(ModalController);
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
      const navController = TestBed.inject(NavController);
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
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      page.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
