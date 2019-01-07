import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { NoteEditorComponent } from '../editors/note-editor/note-editor.component';
import { NotesService } from '../services/notes/notes.service';
import { NoteWithId } from '../models/note';
import { TasksService } from '../services/tasks/tasks.service';
import { TaskWithId } from '../models/task';
import { TaskEditorComponent } from '../editors/task-editor/task-editor.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss']
})
export class TaskPage implements OnDestroy, OnInit {
  private subscriptions: Array<Subscription> = [];
  @ViewChild('notesList') myNotesList: IonList;
  task: TaskWithId;

  taskNotes: Array<NoteWithId>;

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    private notes: NotesService,
    private route: ActivatedRoute,
    private tasks: TasksService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.tasks.get(id).subscribe(t => (this.task = t)));
    this.subscriptions.push(
      this.notes.allFor(id).subscribe(n => {
        if (this.myNotesList) {
          this.myNotesList.closeSlidingItems();
        }
        this.taskNotes = n;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async edit() {
    const m = await this.modal.create({
      component: TaskEditorComponent,
      componentProps: { task: this.task }
    });
    m.present();
  }

  async addNote() {
    const m = await this.modal.create({
      component: NoteEditorComponent,
      componentProps: { itemId: this.task.id }
    });
    m.present();
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
    m.present();
  }
}
