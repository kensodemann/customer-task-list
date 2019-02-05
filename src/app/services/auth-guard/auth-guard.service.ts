import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private navController: NavController
  ) {}

  async canActivate(): Promise<boolean> {
    if (await this.getUser()) {
      return true;
    }

    this.navController.navigateRoot(['login']);
    return false;
  }

  private getUser(): Promise<any> {
    return new Promise(resolve => {
      const s = this.afAuth.user.subscribe(u => {
        resolve(u);
        if (s) {
          s.unsubscribe();
        }
      });
    });
  }
}
