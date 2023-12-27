import { model, Schema } from "mongoose";

const groupSchema = new Schema({
  name: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  promotion: { type: Schema.Types.ObjectId, ref: "Promotion" },
});

export default model("Group", groupSchema);
