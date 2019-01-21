import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

import { ApplicationService } from './services/application/application.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  showTabs: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private navController: NavController,
    public application: ApplicationService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(u => {
      if (!u) {
        this.navController.navigateRoot(['login']);
      }
    });

    this.application.registerForUpdates();
  }
}
