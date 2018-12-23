import { Component } from '@angular/core';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-customers',
  templateUrl: 'customers.page.html',
  styleUrls: ['customers.page.scss']
})
export class CustomersPage {
  constructor(public authentication: AuthenticationService) {}
}
