import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export const onTaskDelete = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(snapshot => {
    const db = admin.firestore();
    const notes = db.collection('notes').where('itemId', '==', snapshot.id);
    notes
      .get()
      .then(notesSnapshot => {
        const batch = db.batch();
        notesSnapshot.forEach(note => {
          console.log('batching delete of note:', note.id);
          batch.delete(note.ref);
        });
        batch
          .commit()
          .catch(err => console.log('Error committing removal of notes', err));
      })
      .catch(err => {
        console.log('Error getting notes', err);
      });
    return null;
  });

export const onCustomerUpdate = functions.firestore
  .document('customers/{customerId}')
  .onUpdate(change => {
    const db = admin.firestore();
    const newName = change.after.data().name;
    if (change.before.data().name !== newName) {
      const tasks = db
        .collection('tasks')
        .where('customerId', '==', change.before.id);
      tasks
        .get()
        .then(tasksSnapshot => {
          const batch = db.batch();
          tasksSnapshot.forEach(task => {
            console.log('batching update of task:', task.id);
            batch.update(task.ref, { customerName: newName });
          });
          batch
            .commit()
            .catch(err =>
              console.log('Error committing update of customer names on tasks', err)
            );
        })
        .catch(err => {
          console.log('Error getting tasks for update of customer name', err);
        });
    }
    return null;
  });
