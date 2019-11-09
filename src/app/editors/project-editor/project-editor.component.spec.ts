import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { ProjectEditorComponent } from './project-editor.component';
import { ProjectsService } from '@app/services/firestore-data';
import { createProjectsServiceMock } from '@app/services/firestore-data/mocks';
import { Project } from '@app/models';

import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';

describe('ProjectEditorComponent', () => {
  let editor: ProjectEditorComponent;
  let fixture: ComponentFixture<ProjectEditorComponent>;
  let projectList: Subject<Array<Project>>;
  let list;

  beforeEach(async(() => {
    projectList = new Subject();
    TestBed.configureTestingModule({
      declarations: [ProjectEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ProjectsService, useFactory: createProjectsServiceMock },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(createOverlayElementMock())
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    const projects = TestBed.get(ProjectsService);
    fixture = TestBed.createComponent(ProjectEditorComponent);
    editor = fixture.componentInstance;
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
        description: 'Some guy named Joe who sells week on my street corner',
        isActive: true
      },
      {
        id: '320KWS',
        name: ' Kenmore ',
        description: 'They used to make stuff for some company called "Sears"',
        isActive: false
      }
    ];
    projects.all.mockReturnValue(projectList);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(editor).toBeTruthy();
  });

  it('sets up an observable on the projects', () => {
    const projects = TestBed.get(ProjectsService);
    fixture.detectChanges();
    expect(projects.all).toHaveBeenCalledTimes(1);
  });

  it('changes the project list', () => {
    fixture.detectChanges();
    projectList.next(list);
    expect(editor.allProjects).toEqual(list);
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      const modal = TestBed.get(ModalController);
      fixture.detectChanges();
      editor.close();
      expect(modal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('in add mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
      projectList.next(list);
    });

    it('starts with a true active status', () => {
      expect(editor.isActive).toEqual(true);
    });

    it('sets the title', () => {
      expect(editor.title).toEqual('Add New Project');
    });

    describe('save', () => {
      it('adds the project', () => {
        const projects = TestBed.get(ProjectsService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(projects.add).toHaveBeenCalledTimes(1);
      });

      it('passes the name, description, and isActive status', () => {
        const projects = TestBed.get(ProjectsService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(projects.add).toHaveBeenCalledWith({
          name: 'The Dude',
          description: 'He does abide',
          isActive: true
        });
      });

      it('allows inactive projects to be created', () => {
        const projects = TestBed.get(ProjectsService);
        editor.name = 'Lazy Leopard';
        (editor.description = 'Cats like to sleep, even the bigger ones.'), (editor.isActive = false);
        editor.save();
        expect(projects.add).toHaveBeenCalledWith({
          name: 'Lazy Leopard',
          description: 'Cats like to sleep, even the bigger ones.',
          isActive: false
        });
      });

      it('dismisses the modal', () => {
        const modal = TestBed.get(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a project by the same name exists', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('does the check case-insensitive', () => {
        editor.name = 'jOe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('ignores starting white-space', () => {
        editor.name = '  Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');

        editor.name = 'Kenmore ';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('ignores ending white-space', () => {
        editor.name = 'Joe  ';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');

        editor.name = ' Kenmore';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('clears the error message if no matching project', () => {
        editor.name = 'Joe';
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
        isActive: false
      };
      fixture.detectChanges();
      projectList.next(list);
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
        const projects = TestBed.get(ProjectsService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(projects.update).toHaveBeenCalledTimes(1);
      });

      it('passes the id, name, description, and isActive status', () => {
        const projects = TestBed.get(ProjectsService);
        editor.name = 'The Dude';
        editor.description = 'He does abide';
        editor.isActive = true;
        editor.save();
        expect(projects.update).toHaveBeenCalledWith({
          id: '531LLS',
          name: 'The Dude',
          description: 'He does abide',
          isActive: true
        });
      });

      it('allows projects to be made inactive', () => {
        const projects = TestBed.get(ProjectsService);
        editor.name = 'Lazy Leopard';
        (editor.description = 'Cats like to sleep, even the bigger ones.'), (editor.isActive = false);
        editor.save();
        expect(projects.update).toHaveBeenCalledWith({
          id: '531LLS',
          name: 'Lazy Leopard',
          description: 'Cats like to sleep, even the bigger ones.',
          isActive: false
        });
      });

      it('dismisses the modal', () => {
        const modal = TestBed.get(ModalController);
        editor.save();
        expect(modal.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('check name', () => {
      it('sets a warning message if a project by the same name exists', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('ignore the project with the same ID', () => {
        editor.project.id = '420HI';
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });

      it('does the check case-insensitive', () => {
        editor.name = 'jOe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('ignores starting white-space', () => {
        editor.name = '  Joe';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');

        editor.name = 'Kenmore ';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('ignores ending white-space', () => {
        editor.name = 'Joe  ';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');

        editor.name = ' Kenmore';
        editor.checkName();
        expect(editor.warningMessage).toEqual('a project with this name already exists');
      });

      it('clears the error message if no matching project', () => {
        editor.name = 'Joe';
        editor.checkName();
        expect(editor.warningMessage).toBeTruthy();

        editor.name = 'Jill';
        editor.checkName();
        expect(editor.warningMessage).toBeFalsy();
      });
    });
  });
});
