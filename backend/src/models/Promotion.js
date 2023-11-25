import {model, Schema} from "mongoose";

const promotionSchema = new Schema({
    name: {type: String, required: true},
    groups: [{type: Schema.Types.ObjectId, ref: "Group"}],
});

export default model("Promotion", promotionSchema);
