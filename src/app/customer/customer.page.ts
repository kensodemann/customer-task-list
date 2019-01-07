import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonList,
  ModalController,
  NavController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CustomerEditorComponent } from '../editors/customer-editor/customer-editor.component';
import { CustomersService } from '../services/customers/customers.service';
import { CustomerWithId } from '../models/customer';
import { NoteEditorComponent } from '../editors/note-editor/note-editor.component';
import { NotesService } from '../services/notes/notes.service';
import { NoteWithId } from '../models/note';
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

  @ViewChild('notesList') myNotesList: IonList;

  customer: CustomerWithId;
  customerNotes: Array<NoteWithId>;
  statuses: Array<string>;

  constructor(
    private alert: AlertController,
    private customers: CustomersService,
    private modal: ModalController,
    public navController: NavController,
    private notes: NotesService,
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
      this.notes.allFor(id).subscribe(n => {
        if (this.myNotesList) {
          this.myNotesList.closeSlidingItems();
        }
        this.customerNotes = n;
      })
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
      component: NoteEditorComponent,
      componentProps: { itemId: this.customer.id }
    });
    return await m.present();
  }

  async deleteNote(note: NoteWithId): Promise<void> {
    const a = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to perminantly remove this note?',
      buttons: [
        { text: 'Yes', handler: () => this.notes.delete(note) },
        { text: 'No', role: 'cancel' }
      ]
    });
    return a.present();
  }

  async viewNote(note: NoteWithId) {
    const m = await this.modal.create({
      component: NoteEditorComponent,
      componentProps: { note: note }
    });
    return await m.present();
  }

  taskCount(status?: string): number {
    return this.customerTasks
      ? this.customerTasks.filter(t => !status || t.status === status).length
      : 0;
  }
}
