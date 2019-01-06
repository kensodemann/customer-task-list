import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';
import { NotesEditorComponent } from '../editors/notes-editor/notes-editor.component';
import { statuses } from '../default-data';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss']
})
export class CustomerPage implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];
  private customerTasks: Array<TaskWithId>;

  customer: CustomerWithId;
  statuses: Array<string>;

  constructor(
    private customers: CustomersService,
    private modal: ModalController,
    public navController: NavController,
    private route: ActivatedRoute,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    this.statuses = [...statuses];
    const id = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(
      this.tasks.forCustomer(id).subscribe(t => (this.customerTasks = t))
    );
    this.subscriptions.push(
      this.customers.get(id).subscribe(c => (this.customer = c))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async edit() {
    const m = await this.modal.create({
      component: CustomerEditorComponent,
      componentProps: { customer: this.customer }
    });
    return await m.present();
  }

  async addNote() {
    const m = await this.modal.create({
      component: NotesEditorComponent,
      componentProps: { itemId: this.customer.id }
    });
    return await m.present();
  }

  taskCount(status?: string): number {
    return this.customerTasks
      ? this.customerTasks.filter(t => !status || t.status === status).length
      : 0;
  }
}
