import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export const onTaskDelete = functions.firestore
  .document("tasks/{taskId}")
  .onDelete((snapshot) => {
    const db = admin.firestore();
    const notes = db.collection("notes").where("itemId", "==", snapshot.id);
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
          .catch(err => console.log("Error committing removal of notes", err));
      })
      .catch(err => {
        console.log("Error getting notes documents", err);
      });
    return null;
  });
