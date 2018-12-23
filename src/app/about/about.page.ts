import { Component } from '@angular/core';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  constructor(public authentication: AuthenticationService) { }
}
