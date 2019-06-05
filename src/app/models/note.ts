import { firestore } from 'firebase/app';

export interface Note {
  id?: string;
  text: string;
  enteredOn: firestore.Timestamp;
  itemId: string;
}
