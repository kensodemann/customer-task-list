import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CustomersService } from '../../services/customers/customers.service';

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

  async save() {
    await this.customers.add({
      name: this.name,
      description: this.description,
      isActive: this.isActive
    });
    this.modal.dismiss();
  }
}
