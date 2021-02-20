import firebase from 'firebase/app';

export interface Note {
  id?: string;
  text: string;
  enteredOn: firebase.firestore.Timestamp;
  itemId: string;
}
