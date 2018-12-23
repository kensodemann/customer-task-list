import { Component } from '@angular/core';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss']
})
export class TasksPage {
  constructor(public authentication: AuthenticationService) { }
}
