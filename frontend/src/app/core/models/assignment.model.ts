import { Professor } from './professor.model';
import { Group } from './group.model';
import { Subject } from './subject.model';
import { Student } from './student.model';

export interface Assignment {
  _id?: string;
  title: string; // required
  description: string;
  dueDate: Date; // required
  subject: Subject;
  professor: Professor;
  group: Group[];
  createdAt?: Date;
  updatedAt?: Date;

  // Submission fields
  student?: Student;
  submittedAt?: Date;
  isSubmitted?: Boolean;
  grade?: number;
  remarks?: string;
}
