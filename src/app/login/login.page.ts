import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string;
  password: string;
  errorMessage: string;

  constructor(
    private auth: AuthenticationService,
    private navController: NavController
  ) {}

  async login() {
    try {
      const u = await this.auth.login(this.email, this.password);
      if (u) {
        this.navController.navigateRoot('');
      }
    } catch (err) {
      this.password = '';
      this.errorMessage = err.message;
    }
  }
}
