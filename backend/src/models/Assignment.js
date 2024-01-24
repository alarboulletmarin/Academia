import { model, Schema } from "mongoose";

const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject" },
  professor: { type: Schema.Types.ObjectId, ref: "Professor" },
  group: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  student: { type: Schema.Types.ObjectId, ref: "Student" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Submission fields
  submittedAt: { type: Date },
  isSubmitted: { type: Boolean, default: false },
  grade: { type: Number },
  remarks: { type: String },
});

export default model("Assignment", assignmentSchema);
