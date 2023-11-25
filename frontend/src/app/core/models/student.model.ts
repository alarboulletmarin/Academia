import {Group} from './group.model';

export interface Student {
  _id: number;
  firstName: string; // required
  lastName: string; // required
  group: Group;
}
