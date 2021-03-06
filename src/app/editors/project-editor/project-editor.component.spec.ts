import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { create, update } from '@app/store/actions/project.actions';
import { ProjectState } from '@app/store/reducers/project/project.reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  initializeTestProjects,
  testProjectIds,
  testProjects,
} from '@test/data';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { ProjectEditorComponent } from './project-editor.component';

describe('ProjectEditorComponent', () => {
  let editor: ProjectEditorComponent;
  let fixture: ComponentFixture<ProjectEditorComponent>;

  beforeEach(
    waitForAsync(() => {
      initializeTestProjects();
      TestBed.configureTestingModule({
        declarations: [ProjectEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [
          {
            provide: ModalController,
            useFactory: () =>
              createOverlayControllerMock(createOverlayElementMock()),
          },
          provideMockStore<{ projects: ProjectState }>({
            initialState: {
              projects: {
                loading: false,
                ids: testProjectIds,
                entities: testProjects,
              },
            },
          }),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditorComponent);
    editor = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(editor).toBeTruthy();
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      const modal = TestBed.inject(ModalController);
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('starts with a true active status', () => {
      expect(editor.isActive).toEqual(true);
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Add New Project');
    });

    describe('save', () => {
      it('adds the project', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            project: {
              name: editor.name,
              description: editor.description,
              isActive: editor.isActive,
            },
          }),
        );
      });

      it('allows inactive projects to be created', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        editor.name = 'Lazy Leopard';
        editor.description = 'Cats like to sleep, even the bigger ones.';
        editor.isActive = false;
        editor.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            project: {
              name: editor.name,
              description: editor.description,
              isActive: editor.isActive,
            },
          }),
        );
      });

      it('dismisses the modal', () => {
        const modal = TestBed.inject(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a project by the same name exists', () => {
        editor.name = testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('does the check case-insensitive', () => {
        editor.name = testProjects[testProjectIds[2]].name.toUpperCase();
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('ignores starting white-space', () => {
        editor.name = '   ' + testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('ignores ending white-space', () => {
        editor.name = '   ' + testProjects[testProjectIds[2]].name + '   ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('clears the error message if no matching project', () => {
        editor.name = testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toBeTruthy();

        editor.name = 'Jill';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      editor.project = {
        id: '531LLS',
        name: 'Lillies and Cream',
        description: 'I have no idea what that would be',
        isActive: false,
      };
      fixture.detectChanges();
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Modify Project');
    });

    it('initializes the name', () => {
      expect(editor.name).toEqual('Lillies and Cream');
    });

    it('initializes the description', () => {
      expect(editor.description).toEqual('I have no idea what that would be');
    });

    it('initializes the active flag', () => {
      expect(editor.isActive).toEqual(false);
    });

    describe('save', () => {
      it('updates the project', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            project: {
              id: '531LLS',
              name: editor.name,
              description: editor.description,
              isActive: editor.isActive,
            },
          }),
        );
      });

      it('allows projects to be made inactive', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        editor.name = 'Lazy Leopard';
        editor.description = 'Cats like to sleep, even the bigger ones.';
        editor.isActive = false;
        editor.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            project: {
              id: '531LLS',
              name: editor.name,
              description: editor.description,
              isActive: editor.isActive,
            },
          }),
        );
      });

      it('dismisses the modal', () => {
        const modal = TestBed.inject(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a project by the same name exists', () => {
        editor.name = testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('ignore the project with the same ID', () => {
        editor.project.id = testProjects[testProjectIds[2]].id;
        editor.name = testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });

      it('does the check case-insensitive', () => {
        editor.name = testProjects[testProjectIds[2]].name.toUpperCase();
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('ignores starting white-space', () => {
        editor.name = '   ' + testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('ignores ending white-space', () => {
        editor.name = testProjects[testProjectIds[2]].name + '  ';
        editor.checkName();
        expect(editor.warningMessage).toEqual(
          'a project with this name already exists',
        );
      });

      it('clears the error message if no matching project', () => {
        editor.name = testProjects[testProjectIds[2]].name;
        editor.checkName();
        expect(editor.warningMessage).toBeTruthy();

        editor.name = 'Jill';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });
    });
  });
});
