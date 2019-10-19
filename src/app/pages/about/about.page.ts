import { Component } from '@angular/core';

import { AuthenticationService } from '@app/services';
import { version } from '@app/default-data';
import { Version } from '@app/models';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  appVersion: Version = version;

  constructor(public authentication: AuthenticationService) {}
}
