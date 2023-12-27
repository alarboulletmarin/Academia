import { model, Schema } from "mongoose";

const professorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

export default model("Professor", professorSchema);
