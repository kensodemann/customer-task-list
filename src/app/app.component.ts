import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

import { UpdateService } from './services/update/update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private navController: NavController,
    private update: UpdateService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(u => {
      if (!u) {
        this.navController.navigateRoot(['login']);
      }
    });

    this.update.register();
  }
}
