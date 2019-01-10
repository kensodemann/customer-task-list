import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomersService } from '../../services/firestore-data/customers/customers.service';
import { Customer, CustomerWithId } from '../../models/customer';

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss']
})
export class CustomerEditorComponent implements OnDestroy, OnInit {
  name: string;
  description: string;
  isActive: boolean;
  errorMessage: string;
  warningMessage: string;
  title: string;

  allCustomers: Array<CustomerWithId>;
  customersSubscription: Subscription;
  customer: CustomerWithId;

  constructor(
    private customers: CustomersService,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.getCustomers();
    this.setTitle();
    this.initializeProperties();
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }

  close() {
    this.modal.dismiss();
  }

  checkName() {
    const name = this.name && this.name.toLowerCase().trim();
    const id = this.customer && this.customer.id;
    const dup =
      this.allCustomers &&
      this.allCustomers.find(
        x => x.id !== id && x.name.toLowerCase().trim() === name
      );
    this.warningMessage = dup ? 'a customer with this name already exists' : '';
  }

  async save() {
    try {
      if (this.customer) {
        await this.customers.update(this.customerObject() as CustomerWithId);
      } else {
        await this.customers.add(this.customerObject());
      }
      this.modal.dismiss();
    } catch (err) {
      this.errorMessage = err.message || 'Unknown error saving customer';
    }
  }

  private customerObject(): Customer | CustomerWithId {
    const cus: Customer = {
      name: this.name,
      description: this.description,
      isActive: this.isActive
    };

    if (this.customer) {
      (cus as CustomerWithId).id = this.customer.id;
    }

    return cus;
  }

  private getCustomers() {
    this.customersSubscription = this.customers
      .all()
      .subscribe(c => (this.allCustomers = c));
  }

  private initializeProperties() {
    if (this.customer) {
      this.name = this.customer.name;
      this.description = this.customer.description;
      this.isActive = this.customer.isActive;
    } else {
      this.isActive = true;
    }
  }

  private setTitle() {
    this.title = this.customer ? 'Modify Customer' : 'Add New Customer';
  }
}
