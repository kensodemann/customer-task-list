import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CustomersService } from '../../services/customers/customers.service';
import { CustomerWithId } from '../../models/customer';

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss']
})
export class CustomerEditorComponent implements OnInit {
  name: string;
  description: string;
  isActive: boolean;
  errorMessage: string;
  warningMessage: string;

  allCustomers: Array<CustomerWithId>;

  constructor(
    private customers: CustomersService,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.isActive = true;
  }

  close() {
    this.modal.dismiss();
  }

  checkName() {
    const name = this.name && this.name.toLowerCase().trim();
    const dup =
      this.allCustomers &&
      this.allCustomers.find(x => x.name.toLowerCase().trim() === name);
    this.warningMessage = dup ? 'a customer with this name already exists' : '';
  }

  async save() {
    try {
      await this.customers.add({
        name: this.name,
        description: this.description,
        isActive: this.isActive
      });
      this.modal.dismiss();
    } catch (err) {
      this.errorMessage = err.message || 'Unknown error saving customer';
    }
  }
}
