import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Priorities, Statuses, TaskTypes } from '@app/default-data';
import { TaskListItemComponent } from './task-list-item.component';

describe('TaskListItemComponent', () => {
  let component: TaskListItemComponent;
  let fixture: ComponentFixture<TaskListItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TaskListItemComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListItemComponent);
    component = fixture.componentInstance;
    component.task = {
      id: '42DA',
      name: 'Find the answer',
      description: 'First find Deep Thought, then get the answer from it',
      enteredOn: { seconds: 14324053, nanoseconds: 0 } as any,
      type: TaskTypes.feature,
      status: Statuses.closed,
      priority: Priorities.normal,
      projectId: '451BK',
      projectName: 'Book Burners R Us',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the close button if the status is not Closed', () => {
    component.task.status = Statuses.open;
    expect(component.showClosed).toEqual(true);
  });

  it('hides the close button if the status is Closed', () => {
    component.task.status = Statuses.closed;
    expect(component.showClosed).toEqual(false);
  });
});
