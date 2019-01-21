import { Component } from '@angular/core';

import { ApplicationService } from '../services/application/application.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  wideMode: boolean;

  constructor(public application: ApplicationService) {}
}
