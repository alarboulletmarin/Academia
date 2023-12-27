import { model, Schema } from "mongoose";

const submissionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student" },
  assignment: { type: Schema.Types.ObjectId, ref: "Assignment" },
  submittedAt: { type: Date },
});

export default model("Submission", submissionSchema);
