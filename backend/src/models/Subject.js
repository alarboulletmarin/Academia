import {model, Schema} from "mongoose";

const subjectSchema = new Schema({
    name: {type: String, required: true},
    professor: {type: Schema.Types.ObjectId, ref: "Professor"},
});

export default model("Subject", subjectSchema);
