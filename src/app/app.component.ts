import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(u => {
      if (!u) {
        this.navController.navigateRoot(['login']);
      }
    });
  }
}
