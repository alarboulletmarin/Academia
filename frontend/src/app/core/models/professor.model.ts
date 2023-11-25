import {Subject} from './subject.model';

export interface Professor {
  _id: string;
  firstName: string; // required
  lastName: string; // required
  subjects: Subject[];
}
