import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss']
})
export class TasksPage implements OnDestroy, OnInit {
  allTasks: Array<TaskWithId>;

  private taskSubscription: Subscription;

  constructor(
    public authentication: AuthenticationService,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.taskSubscription = this.tasks
      .all()
      .subscribe(t => (this.allTasks = t));
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }
}
