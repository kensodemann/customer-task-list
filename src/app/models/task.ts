import { firestore } from 'firebase/app';

export interface Task {
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  beginDate?: string;
  endDate?: string;
  customerId: string;
  customerName: string;
  enteredOn: firestore.Timestamp;
}

export interface TaskWithId extends Task {
  id: string;
}
