import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

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
  infoMessage: string;

  constructor(
    private alert: AlertController,
    private auth: AuthenticationService,
    private navController: NavController
  ) {}

  clearMessages() {
    this.errorMessage = '';
    this.infoMessage = '';
  }

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

  async handlePasswordReset() {
    this.clearMessages();
    const a = await this.alert.create({
      header: 'Password Reset',
      subHeader: 'Enter your e-mail address',
      message:
        'An e-mail will be sent to the specified e-mail address with a link that will allow you to reset your password.',
      inputs: [
        {
          name: 'emailAddress',
          type: 'email',
          placeholder: 'your.email@address.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send e-mail',
          role: 'send'
        }
      ]
    });
    await a.present();
    const response = await a.onDidDismiss();
    await this.sendPasswordResetEmail(response);
  }

  private async sendPasswordResetEmail(response: any) {
    if (
      response &&
      response.data.values.emailAddress &&
      response.role === 'send'
    ) {
      try {
        await this.auth.sendPasswordResetEmail(
          response.data.values.emailAddress
        );
        this.infoMessage = `An e-mail has been sent to ${
          response.data.values.emailAddress
        } with password reset instructions.`;
      } catch (err) {
        this.errorMessage = err.message;
      }
    }
  }
}
