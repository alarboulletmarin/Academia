import {model, Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, enum: ["professor", "student"], required: true},
        profile: {
            type: Schema.Types.ObjectId,
            refPath: "onModel",
            required: true,
        },
        onModel: {
            type: String,
            required: true,
            enum: ["Professor", "Student"],
        },
        isActive: {type: Boolean, default: true},
        lastLogin: {type: Date},
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default model("User", userSchema);
