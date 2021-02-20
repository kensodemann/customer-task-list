import firebase from 'firebase/app';

export interface Task {
  id?: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  beginDate?: string;
  endDate?: string;
  projectId: string;
  projectName: string;
  enteredOn: firebase.firestore.Timestamp;
}
