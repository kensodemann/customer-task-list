import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { VersionService } from '../services/version/version.service';
import { Version } from '../models/version';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {
  appVersion: Version;

  constructor(
    public authentication: AuthenticationService,
    private version: VersionService
  ) {}

  ngOnInit() {
    this.version.get().subscribe(v => (this.appVersion = v));
  }
}
