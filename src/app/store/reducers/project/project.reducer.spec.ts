import { Dictionary } from '@ngrx/entity';

import { reducer, initialState } from './project.reducer';
import { Project } from '@app/models';
import {
  ProjectActionTypes,
  loadFailure,
  createFailure,
  updateFailure,
  projectAdded,
  projectsAdded,
  projectModified,
  projectRemoved,
} from '@app/store/actions/project.actions';
import { testProjectIds, testProjects, initializeTestProjects } from '@test/data';

beforeEach(() => {
  initializeTestProjects();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(ProjectActionTypes.load, () => {
  it('sets loading true, removes any entities, and undefines any error', () => {
    expect(
      reducer(
        {
          ...initialState,
          ids: [...testProjectIds],
          entities: { ...testProjects },
          error: new Error('the last load failed'),
        },
        { type: ProjectActionTypes.load }
      )
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(ProjectActionTypes.loadFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadFailure({ error: new Error('Could not load the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data'),
    });
  });
});

describe(ProjectActionTypes.create, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ ...initialState, error: new Error('the last create failed') }, { type: ProjectActionTypes.create })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(ProjectActionTypes.createFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = createFailure({ error: new Error('Could not create the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not create the data'),
    });
  });
});

describe(ProjectActionTypes.update, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ ...initialState, error: new Error('the last update failed') }, { type: ProjectActionTypes.update })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(ProjectActionTypes.updateFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = updateFailure({ error: new Error('Could not update the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not update the data'),
    });
  });
});

describe(ProjectActionTypes.projectAdded, () => {
  it('adds the project to an empty state', () => {
    const project: Project = {
      id: '194309fkadsfoi',
      name: 'Newbie',
      description: 'I am a newly added project',
      isActive: true,
    };
    const action = projectAdded({ project });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      ids: ['194309fkadsfoi'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Newbie',
          description: 'I am a newly added project',
          isActive: true,
        },
      },
    });
  });

  it('adds the timer to the existing ones', () => {
    const project: Project = {
      id: '194309fkadsfoi',
      name: 'Newbie',
      description: 'I am a newly added project',
      isActive: true,
    };
    const action = projectAdded({ project });
    expect(reducer({ ...initialState, loading: true, ids: testProjectIds, entities: testProjects }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [...testProjectIds, '194309fkadsfoi'],
      entities: {
        ...testProjects,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Newbie',
          description: 'I am a newly added project',
          isActive: true,
        },
      },
    });
  });
});

describe(ProjectActionTypes.projectsAdded, () => {
  it('adds the projects to an empty state', () => {
    const projects: Array<Project> = [
      {
        id: '194309fkadsfoi',
        name: 'Newbie',
        description: 'I am a newly added project',
        isActive: true,
      },
      {
        id: 'fiiagoie92',
        name: 'Newbie Too',
        description: 'I am another newly added project',
        isActive: true,
      },
      {
        id: 'figof003f3',
        name: 'the day',
        description: 'It is all ok',
        isActive: false,
      },
    ];
    const action = projectsAdded({ projects });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      loading: false,
      ids: ['194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Newbie',
          description: 'I am a newly added project',
          isActive: true,
        },
        fiiagoie92: {
          id: 'fiiagoie92',
          name: 'Newbie Too',
          description: 'I am another newly added project',
          isActive: true,
        },
        figof003f3: {
          id: 'figof003f3',
          name: 'the day',
          description: 'It is all ok',
          isActive: false,
        },
      },
    });
  });

  it('adds the projects to a populated state', () => {
    const projects: Array<Project> = [
      {
        id: '194309fkadsfoi',
        name: 'Newbie',
        description: 'I am a newly added project',
        isActive: true,
      },
      {
        id: 'fiiagoie92',
        name: 'Newbie Too',
        description: 'I am another newly added project',
        isActive: true,
      },
      {
        id: 'figof003f3',
        name: 'the day',
        description: 'It is all ok',
        isActive: false,
      },
    ];
    const action = projectsAdded({ projects });
    expect(reducer({ ...initialState, loading: true, ids: testProjectIds, entities: testProjects }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [...testProjectIds, '194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        ...testProjects,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Newbie',
          description: 'I am a newly added project',
          isActive: true,
        },
        fiiagoie92: {
          id: 'fiiagoie92',
          name: 'Newbie Too',
          description: 'I am another newly added project',
          isActive: true,
        },
        figof003f3: {
          id: 'figof003f3',
          name: 'the day',
          description: 'It is all ok',
          isActive: false,
        },
      },
    });
  });
});

describe(ProjectActionTypes.projectModified, () => {
  it('modifies the specified project', () => {
    const project: Project = {
      id: 'ri49950399vf',
      name: 'Changling',
      description: 'I am a modified project',
      isActive: true,
    };
    const expected = { ...testProjects };
    expected.ri49950399vf = project;
    const action = projectModified({ project });
    expect(reducer({ ...initialState, loading: true, ids: testProjectIds, entities: testProjects }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: testProjectIds,
      entities: expected,
    });
  });
});

describe(ProjectActionTypes.projectRemoved, () => {
  it('deletes the timer', () => {
    const project: Project = {
      id: 'pproti3993kgi',
      name: 'Time Trax',
      description: 'An older time tracking project',
      isActive: false,
    };
    const expected = { ...testProjects };
    delete expected.pproti3993kgi;
    const action = projectRemoved({ project });
    expect(reducer({ ...initialState, loading: true, ids: testProjectIds, entities: testProjects }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [
        testProjectIds[0],
        testProjectIds[1],
        testProjectIds[2],
        testProjectIds[3],
        testProjectIds[5],
        testProjectIds[6],
      ],
      entities: expected,
    });
  });
});
