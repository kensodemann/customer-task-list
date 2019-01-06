import { Timestamp } from 'firebase/firestore';

export interface Note {
  text: string;
  enteredOn: Timestamp;
  itemId: string;
}

export interface NoteWithId extends Note {
  id: string;
}
