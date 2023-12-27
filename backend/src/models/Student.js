import { model, Schema } from "mongoose";

const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  group: { type: Schema.Types.ObjectId, ref: "Group" },
});

export default model("Student", studentSchema);
