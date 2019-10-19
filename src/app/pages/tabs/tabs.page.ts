import { Component } from '@angular/core';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public application: ApplicationService) {}
}
