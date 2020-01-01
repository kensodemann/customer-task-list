import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { ApplicationService } from './services/application/application.service';
import { State } from './store';
import { loginChanged } from './store/actions/auth.actions';
import { load as loadProject } from './store/actions/project.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  showTabs: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private navController: NavController,
    private store: Store<State>,
    public application: ApplicationService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(u => {
      this.store.dispatch(loginChanged({ email: u && u.email }));
      if (u) {
        this.store.dispatch(loadProject());
      } else {
        this.navController.navigateRoot(['login']);
      }
    });

    this.application.registerForUpdates();
  }
}
