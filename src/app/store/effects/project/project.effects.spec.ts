import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Project } from '@app/models';
import { ProjectsService } from '@app/services/firestore-data';
import { createProjectsServiceMock } from '@app/services/firestore-data/mocks';
import * as projectActions from '@app/store/actions/project.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProjectEffects } from './project.effects';

let actions$: Observable<any>;
let effects: ProjectEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ProjectEffects,
      { provide: ProjectsService, useFactory: createProjectsServiceMock },
      provideMockActions(() => actions$),
    ],
  });

  effects = TestBed.inject<ProjectEffects>(ProjectEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('load$', () => {
  it('observes changes to the projects', () => {
    const projectsService = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.load());
    effects.changes$.subscribe(() => {});
    expect(projectsService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches and added project action', (done) => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as jest.Mock).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Newbie',
                  description: 'I am a newly added project',
                  isActive: true,
                }),
              },
            },
          },
        ])
      );
      actions$ = of(projectActions.load());
      effects.changes$.subscribe((action) => {
        const expected = projectActions.projectAdded({
          project: {
            id: '123499dfi',
            name: 'Newbie',
            description: 'I am a newly added project',
            isActive: true,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches and modified project action', (done) => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as jest.Mock).mockReturnValue(
        of([
          {
            type: 'modified',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Tree Planting',
                  description: 'I am a modified project',
                  isActive: false,
                }),
              },
            },
          },
        ])
      );
      actions$ = of(projectActions.load());
      effects.changes$.subscribe((action) => {
        const expected = projectActions.projectModified({
          project: {
            id: '123499dfi',
            name: 'Tree Planting',
            description: 'I am a modified project',
            isActive: false,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches and removed project action', (done) => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as jest.Mock).mockReturnValue(
        of([
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Testing',
                  description: 'I am a project',
                  isActive: true,
                }),
              },
            },
          },
        ])
      );
      actions$ = of(projectActions.load());
      effects.changes$.subscribe((action) => {
        const expected = projectActions.projectRemoved({
          project: {
            id: '123499dfi',
            name: 'Testing',
            description: 'I am a project',
            isActive: true,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as jest.Mock).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: 'f99g0e9fg',
                data: () => ({
                  name: 'Do Something',
                  description: 'I am a project',
                  isActive: false,
                }),
              },
            },
          },
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Do Something Else',
                  description: 'I am another project',
                  isActive: true,
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fkkfig0939r',
                data: () => ({
                  name: 'New One',
                  description: 'I am a new project',
                  isActive: true,
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fiig0939034',
                data: () => ({
                  name: 'Freebie',
                  description: 'I am another new project',
                  isActive: true,
                }),
              },
            },
          },
          {
            type: 'modified',
            payload: {
              doc: {
                id: 'fi38849958392j',
                data: () => ({
                  name: 'Rehab',
                  description: 'I am a changed project',
                  isActive: true,
                }),
              },
            },
          },
        ])
      );
      actions$ = of(projectActions.load());
      let calls = 0;
      effects.changes$.subscribe((action) => {
        let expected: Action;
        switch (calls) {
          case 0:
            expected = projectActions.projectRemoved({
              project: {
                id: '123499dfi',
                name: 'Do Something Else',
                description: 'I am another project',
                isActive: true,
              },
            });
            break;

          case 1:
            expected = projectActions.projectModified({
              project: {
                id: 'fi38849958392j',
                name: 'Rehab',
                description: 'I am a changed project',
                isActive: true,
              },
            });
            break;

          case 2:
            expected = projectActions.projectsAdded({
              projects: [
                {
                  id: 'f99g0e9fg',
                  name: 'Do Something',
                  description: 'I am a project',
                  isActive: false,
                },
                {
                  id: 'fkkfig0939r',
                  name: 'New One',
                  description: 'I am a new project',
                  isActive: true,
                },
                {
                  id: 'fiig0939034',
                  name: 'Freebie',
                  description: 'I am another new project',
                  isActive: true,
                },
              ],
            });
            break;

          default:
            break;
        }
        expect(action).toEqual(expected);
        calls++;
        tick();
      });
      expect(calls).toEqual(3);
    }));
  });

  it('does nothing for other actions', () => {
    const projectsService = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.update({ project: null }));
    effects.changes$.subscribe(() => {});
    expect(projectsService.observeChanges).not.toHaveBeenCalled();
  });
});

describe('create$', () => {
  let project: Project;
  beforeEach(() => {
    project = {
      id: 'fkkfig0939r',
      name: 'Something',
      description: 'I am a project',
      isActive: true,
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.create({ project }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(project);
  });

  it('dispatches create success', (done) => {
    actions$ = of(projectActions.create({ project }));
    effects.create$.subscribe((action) => {
      expect(action).toEqual(projectActions.createSuccess());
      done();
    });
  });

  it('dispatches create errors', (done) => {
    const service = TestBed.inject(ProjectsService);
    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(projectActions.create({ project }));
    effects.create$.subscribe((action) => {
      expect(action).toEqual(
        projectActions.createFailure({
          error: new Error('The create failed'),
        })
      );
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.update({ project }));
    effects.create$.subscribe(() => {});
    expect(service.add).not.toHaveBeenCalled();
  });
});

describe('update$', () => {
  let project: Project;
  beforeEach(() => {
    project = {
      id: 'fkkfig0939r',
      name: 'Something',
      description: 'I am a project',
      isActive: true,
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.update({ project }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(project);
  });

  it('dispatches update success', (done) => {
    actions$ = of(projectActions.update({ project }));
    effects.update$.subscribe((action) => {
      expect(action).toEqual(projectActions.updateSuccess());
      done();
    });
  });

  it('dispatches update errors', (done) => {
    const service = TestBed.inject(ProjectsService);
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(projectActions.update({ project }));
    effects.update$.subscribe((action) => {
      expect(action).toEqual(
        projectActions.updateFailure({
          error: new Error('The update failed'),
        })
      );
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(projectActions.create({ project }));
    effects.update$.subscribe(() => {});
    expect(service.update).not.toHaveBeenCalled();
  });
});
