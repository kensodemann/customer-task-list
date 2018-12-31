import { Timestamp } from 'firebase/firestore';

export interface Task {
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  dueDate?: string;
  customer: {
    id: string,
    name: string
  };
  enteredOn: Timestamp;
}

export interface TaskWithId extends Task {
  id: string;
}
