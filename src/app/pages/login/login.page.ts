import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { selectAuthEmail, selectAuthError, selectAuthLoading, selectAuthMessage, State } from '@app/store';
import { login, resetPassword } from '@app/store/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  email: string;
  password: string;
  errorMessage: string;
  infoMessage: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private loading: HTMLIonLoadingElement;

  constructor(
    private alert: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    private store: Store<State>
  ) {}

  async ngOnInit() {
    this.loading = await this.loadingController.create({ message: 'Verifying...' });
    this.store.pipe(select(selectAuthLoading), takeUntil(this.destroy$)).subscribe((l) => {
      this.showLoading(l);
    });
    this.store.pipe(select(selectAuthError), takeUntil(this.destroy$)).subscribe((e) => {
      this.setErrorMessage(e);
    });
    this.store.pipe(select(selectAuthMessage), takeUntil(this.destroy$)).subscribe((msg) => {
      this.infoMessage = msg;
    });
    this.store.pipe(select(selectAuthEmail), takeUntil(this.destroy$)).subscribe((e) => {
      this.goToApp(!!e);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  clearMessages() {
    this.errorMessage = '';
    this.infoMessage = '';
  }

  login() {
    this.store.dispatch(login({ email: this.email, password: this.password }));
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
          placeholder: 'your.email@address.com',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send e-mail',
          role: 'send',
        },
      ],
    });
    await a.present();
    const response = await a.onDidDismiss();
    if (response && response.data && response.data.values.emailAddress && response.role === 'send') {
      this.store.dispatch(resetPassword({ email: response.data.values.emailAddress }));
    }
  }

  private showLoading(show: boolean) {
    if (show) {
      this.loading.present();
    } else {
      this.loading.dismiss();
    }
  }

  private setErrorMessage(error: Error) {
    this.errorMessage = error && error.message;
    if (this.errorMessage) {
      this.password = '';
    }
  }

  private goToApp(doNav: boolean) {
    if (doNav) {
      this.navController.navigateRoot('');
    }
  }
}
