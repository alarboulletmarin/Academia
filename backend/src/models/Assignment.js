import {model, Schema} from "mongoose";

const assignmentSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    dueDate: {type: Date, required: true},
    subject: {type: Schema.Types.ObjectId, ref: "Subject"},
    attachments: [{type: String}],
    professor: {type: Schema.Types.ObjectId, ref: "Professor"},
    group: [{type: Schema.Types.ObjectId, ref: "Group"}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

export default model("Assignment", assignmentSchema);
