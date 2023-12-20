import express from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";

import {
  jwtTokenAuthentication,
  requireRole,
} from "../core/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
  "/",
  jwtTokenAuthentication,
  requireRole("professor"),
  createStudent,
);
router.get("/:id", jwtTokenAuthentication, getStudent);
router.get("/", jwtTokenAuthentication, getStudents);
router.put(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  updateStudent,
);
router.delete(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  deleteStudent,
);

export default router;
