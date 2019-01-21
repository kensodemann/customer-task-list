import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(
    private alert: AlertController,
    private platform: Platform,
    private update: SwUpdate
  ) {}

  get showTabs(): boolean {
    return !(this.platform.is('tablet') || this.platform.is('desktop'));
  }

  registerForUpdates() {
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
