import express from "express";
import {getUser, getUsers, loginUser} from "../controllers/userController.js";
import {jwtTokenAuthentication} from "../config/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post("/login", loginUser);

router.get("/:id", jwtTokenAuthentication, getUser);

router.get("/", jwtTokenAuthentication, getUsers);

export default router;
