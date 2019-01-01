import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';
import { statuses } from '../default-data';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss']
})
export class CustomerPage implements OnDestroy, OnInit {
  private subscription: Subscription;
  customer: CustomerWithId;
  statuses: Array<string>;

  constructor(
    private customers: CustomersService,
    public navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.statuses = [...statuses];
    const id = this.route.snapshot.paramMap.get('id');
    this.subscription = this.customers.get(id).subscribe(c => this.customer = c);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
