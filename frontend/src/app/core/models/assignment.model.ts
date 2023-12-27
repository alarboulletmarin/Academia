import { Professor } from './professor.model';
import { Group } from './group.model';
import { Subject } from './subject.model';
import { AssignmentAttachment } from './attachment.model';

export interface Assignment {
  _id?: string;
  title: string; // required
  description: string;
  dueDate: Date; // required
  subject: Subject;
  attachment: AssignmentAttachment; // filePath
  professor: Professor;
  group: Group[];
  createdAt?: Date;
  updatedAt?: Date;
}
