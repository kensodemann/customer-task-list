import { Timestamp } from './timestamp';

export interface Task {
  name: string;
  description: string;
  type: string;
  status: string;
  enteredOn: Timestamp;
}

export interface TaskWithId extends Task {
  id: string;
}
