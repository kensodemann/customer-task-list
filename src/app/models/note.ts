import { firestore } from 'firebase/app';

export interface Note {
  text: string;
  enteredOn: firestore.Timestamp;
  itemId: string;
}

export interface NoteWithId extends Note {
  id: string;
}
