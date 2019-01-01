import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';

@Component({
  selector: 'app-customers',
  templateUrl: 'customers.page.html',
  styleUrls: ['customers.page.scss']
})
export class CustomersPage implements OnDestroy, OnInit {
  private customersSubscription: Subscription;

  allCustomers: Array<CustomerWithId>;

  constructor(
    private customers: CustomersService,
    private modal: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.customersSubscription = this.customers
      .all()
      .subscribe(c => (this.allCustomers = c));
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }

  async add() {
    const m = await this.modal.create({
      component: CustomerEditorComponent,
      componentProps: { allCustomers: this.allCustomers }
    });
    m.present();
  }

  async edit(c: CustomerWithId) {
    const m = await this.modal.create({
      component: CustomerEditorComponent,
      componentProps: { customer: c, allCustomers: this.allCustomers }
    });
    m.present();
  }

  view(c: CustomerWithId) {
    this.navController.navigateForward(['customer', c.id]);
  }
}
