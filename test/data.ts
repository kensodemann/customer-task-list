import { Dictionary } from '@ngrx/entity';
import { Project } from '@app/models';

export let testProjectIds: Array<string>;
export let testProjects: Dictionary<Project>;

export function initializeTestProjects() {
  testProjectIds = [
    'a19943kkg039',
    'ri49950399vf',
    'iriit003499340',
    'fiig9488593',
    'pproti3993kgi',
    'aa9300kfii593',
    'b99f03590do'
  ];
  testProjects = {
    a19943kkg039: {
      id: 'a19943kkg039',
      name: 'Gizmo',
      description: 'She is my biggest pet project',
      isActive: true
    },
    ri49950399vf: {
      id: 'ri49950399vf',
      name: 'Project Task List',
      description: 'Keep track of my own projects',
      isActive: true
    },
    iriit003499340: {
      id: 'iriit003499340',
      name: 'Personal Task Timer',
      description: 'A simple time tracking app',
      isActive: true
    },
    fiig9488593: {
      id: 'fiig9488593',
      name: 'Cow',
      description: 'She is another pet project',
      isActive: true
    },
    pproti3993kgi: {
      id: 'pproti3993kgi',
      name: 'Time Trax',
      description: 'An older time tracking project',
      isActive: false
    },
    aa9300kfii593: {
      id: 'aa9300kfii593',
      name: 'Math War',
      description: 'War style flashcard game',
      isActive: false
    },
    b99f03590do: {
      id: 'b99f03590do',
      name: 'Figmo',
      description: 'A figment of my imagination',
      isActive: true
    }
  };
}
