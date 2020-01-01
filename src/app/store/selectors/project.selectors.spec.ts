import { ProjectState } from '../reducers/project/project.reducer';
import { selectAllProjects, selectAllActiveProjects, selectProject } from './project.selectors';
import { testProjects, testProjectIds, initializeTestProjects } from '@test/data';

describe('project selectors', () => {
  let state: { projects: ProjectState };

  beforeEach(() => {
    initializeTestProjects();
    state = { projects: { loading: false, ids: testProjectIds, entities: testProjects } };
  });

  describe('select all projects', () => {
    it('returns all projects', () => {
      expect(selectAllProjects(state)).toEqual([
        {
          id: 'a19943kkg039',
          name: 'Gizmo',
          description: 'She is my biggest pet project',
          isActive: true
        },
        {
          id: 'ri49950399vf',
          name: 'Project Task List',
          description: 'Keep track of my own projects',
          isActive: true
        },
        {
          id: 'iriit003499340',
          name: 'Personal Task Timer',
          description: 'A simple time tracking app',
          isActive: true
        },
        {
          id: 'fiig9488593',
          name: 'Cow',
          description: 'She is another pet project',
          isActive: true
        },
        {
          id: 'pproti3993kgi',
          name: 'Time Trax',
          description: 'An older time tracking project',
          isActive: false
        },
        {
          id: 'aa9300kfii593',
          name: 'Math War',
          description: 'War style flashcard game',
          isActive: false
        },
        {
          id: 'b99f03590do',
          name: 'Figmo',
          description: 'A figment of my imagination', 
          isActive: true
        }
      ]);
    });
  });

  describe('select all active projects', () => {
    it('returns all active projects', () => {
      expect(selectAllActiveProjects(state)).toEqual([
        {
          id: 'a19943kkg039',
          name: 'Gizmo',
          description: 'She is my biggest pet project',
          isActive: true
        },
        {
          id: 'ri49950399vf',
          name: 'Project Task List',
          description: 'Keep track of my own projects',
          isActive: true
        },
        {
          id: 'iriit003499340',
          name: 'Personal Task Timer',
          description: 'A simple time tracking app',
          isActive: true
        },
        {
          id: 'fiig9488593',
          name: 'Cow',
          description: 'She is another pet project',
          isActive: true
        },
        {
          id: 'b99f03590do',
          name: 'Figmo',
          description: 'A figment of my imagination',
          isActive: true
        }
      ]);
    });

    it('returns an empty array if there are no active projects', () => {
      testProjects.a19943kkg039.isActive = false;
      testProjects.ri49950399vf.isActive = false;
      testProjects.iriit003499340.isActive = false;
      testProjects.fiig9488593.isActive = false;
      testProjects.b99f03590do.isActive = false;
      expect(selectAllActiveProjects(state)).toEqual([]);
    });
  });

  describe('select project', () => {
    it('returns the selected project', () => {
      expect(selectProject(state, { id: 'iriit003499340' })).toEqual({
        id: 'iriit003499340',
        name: 'Personal Task Timer',
        description: 'A simple time tracking app',
        isActive: true
      });
    });

    it('retuns undefined if there are no matching projects', () => {
      expect(selectProject(state, { id: 'ixasdf124' })).toBeUndefined();
    });
  });
});
