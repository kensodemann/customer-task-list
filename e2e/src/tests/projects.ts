import { ProjectPage } from '../page-objects/pages/project.po';
import { ProjectsPage } from '../page-objects/pages/projects.po';
import { ProjectEditor } from '../page-objects/editors/project-editor.po';
import { NoteEditor } from '../page-objects/editors/note-editor.po';

import { browser } from 'protractor';

export function registerProjectTests(
  project: ProjectPage,
  projects: ProjectsPage,
  projectEditor: ProjectEditor,
  noteEditor: NoteEditor
) {
  describe('Projects', () => {
    beforeEach(() => {
      projects.load();
      projects.waitUntilVisible();
    });

    it('shows the existing projects in alphabetical order', () => {
      const c = projects.getProjects();
      expect(c.count()).toEqual(7);
      expect(c.get(0).getText()).toContain('A+ Storage');
      expect(c.get(1).getText()).toContain('Burger Chef');
      expect(c.get(2).getText()).toContain('Institutional Food Service');
      expect(c.get(3).getText()).toContain('JP Morgan Chase Bank');
      expect(c.get(4).getText()).toContain(`Mike's Modal Meltdown`);
      expect(c.get(5).getText()).toContain('Penta Technologies');
      expect(c.get(6).getText()).toContain('Xeno Tech Solutions');
    });

    describe('clicking add project', () => {
      it('displays the project editor', () => {
        projects.clickAddButton();
        projectEditor.waitUntilVisible();
        expect(projectEditor.getName()).toBeFalsy();
        expect(projectEditor.getDescription()).toBeFalsy();
        expect(projectEditor.getIsActive()).toBeTruthy();
      });

      it('allows entry of name and description', () => {
        projects.clickAddButton();
        projectEditor.waitUntilVisible();
        projectEditor.enterName('a name');
        projectEditor.enterDescription('this is a description');
        expect(projectEditor.getName()).toEqual('a name');
        expect(projectEditor.getDescription()).toEqual('this is a description');
      });

      it('allows the active flag to be toggled', () => {
        projects.clickAddButton();
        projectEditor.waitUntilVisible();
        projectEditor.toggleIsActive();
        expect(projectEditor.getIsActive()).toBeFalsy();
      });
    });

    describe('clicking a project', () => {
      beforeEach(() => {
        const c = projects.getProjects();
        c.get(3).click();
        project.waitUntilVisible();
      });

      it('loads the project page', () => {
        expect(project.nameText).toContain('JP Morgan Chase Bank');
        expect(project.descriptionText).toContain('One of the larger banks in the banking industry.');
        expect(project.isActiveText).toContain('true');
      });

      describe('clicking back', () => {
        it('goes back to the projects list page', () => {
          project.clickBackbutton();
          project.waitUntilInvisible();
          projects.waitUntilVisible();
        });
      });

      describe('clicking add note', () => {
        it('loads the notes editor', () => {
          project.clickAddNote();
          noteEditor.waitUntilVisible();
          expect(noteEditor.getNoteText()).toBeFalsy();
        });

        it('allows the entry of note text', () => {
          project.clickAddNote();
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText('this is a happy note');
          expect(noteEditor.getNoteText()).toEqual('this is a happy note');
        });
      });

      describe('clicking an existing note', () => {
        it('loads the notes editor with the note', () => {
          project.clickNote(1);
          noteEditor.waitUntilVisible();
          expect(noteEditor.getNoteText()).toEqual('This is a note just to make sure that we have three of them.');
        });

        it('allows the entry of more note text', () => {
          project.clickNote(1);
          noteEditor.waitUntilVisible();
          noteEditor.enterNoteText(' And this is new text.');
          expect(noteEditor.getNoteText()).toEqual(
            'This is a note just to make sure that we have three of them. And this is new text.'
          );
        });
      });

      describe('clicking the edit project button', () => {
        it('loads the editor page with the project information', () => {
          project.clickEditButton();
          projectEditor.waitUntilVisible();
          expect(projectEditor.getName()).toEqual('JP Morgan Chase Bank');
          expect(projectEditor.getDescription()).toEqual('One of the larger banks in the banking industry.');
          expect(projectEditor.getIsActive()).toBeTruthy();
        });

        it('allows the project data to be changed', () => {
          project.clickEditButton();
          projectEditor.waitUntilVisible();
          projectEditor.toggleIsActive();
          projectEditor.enterDescription(' This is more description.');
          projectEditor.enterName(' This is extra for the name.');
          expect(projectEditor.getName()).toEqual('JP Morgan Chase Bank This is extra for the name.');
          expect(projectEditor.getDescription()).toEqual(
            'One of the larger banks in the banking industry. This is more description.'
          );
          expect(projectEditor.getIsActive()).toBeFalsy();
        });
      });
    });
  });
}
