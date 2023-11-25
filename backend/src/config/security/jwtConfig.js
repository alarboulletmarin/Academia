import dotenv from "dotenv";

dotenv.config();
export default {
    secret: process.env.JWT_SECRETKEY,
    expiresIn: "1d",
};
