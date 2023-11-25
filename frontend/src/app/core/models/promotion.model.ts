import {Group} from './group.model';

export interface Promotion {
  _id: string;
  name: string; // required
  groups: Group[];
}
