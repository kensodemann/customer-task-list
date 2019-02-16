import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { version } from '../../default-data';
import { Version } from '../../models/version';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  appVersion: Version = version;

  constructor(
    public authentication: AuthenticationService
  ) {}
}
