import {Professor} from './professor.model';

export interface Subject {
  _id: string;
  name: string; // required
  professor: Professor;
}
