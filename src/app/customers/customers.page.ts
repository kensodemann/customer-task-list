import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomerEditorComponent } from './customer-editor/customer-editor.component';
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
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.customersSubscription = this.customers
      .all()
      .subscribe(c => (this.allCustomers = c));
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }

  async addCustomer() {
    console.log('in the add customer');
    const m = await this.modal.create({ component: CustomerEditorComponent });
    m.present();
  }
}
