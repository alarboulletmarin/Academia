import {Promotion} from './promotion.model';
import {Student} from './student.model';

export interface Group {
  _id: string;
  name: string; // required
  students: Student[];
  promotion: Promotion;
}
