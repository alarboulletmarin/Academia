export interface User {
  _id: string;
  email: string; // required & unique
  password: string; // required
  role: "professor" | "student"; // required
  profile: string; // required
  onModel: "Professor" | "Student";
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

