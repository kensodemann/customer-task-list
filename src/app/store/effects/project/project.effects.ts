import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Project } from '@app/models';
import { ProjectsService } from '@app/services/firestore-data';
import * as projectActions from '@app/store/actions/project.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

interface ProjectChangeAction {
  type: string;
  project?: Project;
  projects?: Array<Project>;
}

@Injectable()
export class ProjectEffects {
  changes$ = createEffect(() =>
    // TODO: We need another kind of "load" method that returns a different observable
    this.actions$.pipe(
      ofType(projectActions.load),
      mergeMap(() =>
        this.projectsService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          map(action => this.projectAction(action)),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(projectActions.create),
      mergeMap(action =>
        from(this.projectsService.add(action.project)).pipe(
          map(() => projectActions.createSuccess()),
          catchError(error => of(projectActions.createFailure({ error }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(projectActions.update),
      mergeMap(action =>
        from(this.projectsService.update(action.project)).pipe(
          map(() => projectActions.updateSuccess()),
          catchError(error => of(projectActions.updateFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private projectsService: ProjectsService,
  ) {}

  private unpackActions(
    actions: Array<DocumentChangeAction<Project>>,
  ): Array<ProjectChangeAction> {
    let mainActions: Array<DocumentChangeAction<Project>>;
    let groupedActions: Array<DocumentChangeAction<Project>>;
    if (actions.length > 1) {
      groupedActions = actions.filter(a => a.type === 'added');
      mainActions = actions.filter(a => a.type !== 'added');
    } else {
      groupedActions = [];
      mainActions = actions;
    }

    const changeActions: Array<ProjectChangeAction> = mainActions.map(
      action => ({
        type: action.type,
        project: this.docActionToProject(action),
      }),
    );

    if (groupedActions.length) {
      changeActions.push({
        type: 'added many',
        projects: groupedActions.map(action => this.docActionToProject(action)),
      });
    }

    return changeActions;
  }

  private docActionToProject(action: DocumentChangeAction<Project>): Project {
    return {
      id: action.payload.doc.id,
      ...(action.payload.doc.data() as Project),
    };
  }

  private projectAction(action: ProjectChangeAction): Action {
    switch (action.type) {
      case 'added many':
        return projectActions.projectsAdded({ projects: action.projects });

      case 'added':
        return projectActions.projectAdded({ project: action.project });

      case 'modified':
        return projectActions.projectModified({ project: action.project });

      case 'removed':
        return projectActions.projectRemoved({ project: action.project });

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}
