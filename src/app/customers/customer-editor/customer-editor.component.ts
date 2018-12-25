import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss']
})
export class CustomerEditorComponent implements OnInit {
  name: string;
  description: string;
  errorMessage: string;

  constructor(private modal: ModalController) {}

  ngOnInit() {}

  close() {
    this.modal.dismiss();
  }

  save() {
    this.modal.dismiss();
  }
}
