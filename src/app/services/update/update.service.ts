import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(private alert: AlertController, private update: SwUpdate) {}

  register() {
    this.update.available.subscribe(() => this.promptUser());
  }

  private async promptUser() {
    const alert = await this.alert.create({
      header: 'Update Available',
      message:
        'An update is available for this application. Would you like to restart this application to get the update?',
      buttons: [
        {
          text: 'Yes',
          handler: () =>
            this.update.activateUpdate().then(() => document.location.reload())
        },
        { text: 'No', role: 'cancel' }
      ]
    });
    alert.present();
  }
}
