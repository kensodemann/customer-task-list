import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  constructor(
    private auth: AuthenticationService,
    private navController: NavController
  ) {}

  async login() {
    try {
      const u = await this.auth.login();
      if (u) {
        this.navController.navigateRoot('');
      }
    } catch (err) {
      console.error('login error', err);
    }
  }
}
