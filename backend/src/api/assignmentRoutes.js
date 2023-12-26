import express from "express";
import {
  createAssignment,
  deleteAssignment,
  generateAssignments,
  getAssignment,
  getAssignments,
  updateAssignment,
} from "../controllers/assignmentController.js";

import {
  jwtTokenAuthentication,
  requireRole,
} from "../core/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
  "/",
  jwtTokenAuthentication,
  requireRole("professor"),
  createAssignment,
);
router.get("/:id", jwtTokenAuthentication, getAssignment);
router.get("/", jwtTokenAuthentication, getAssignments);
router.put(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  updateAssignment,
);
router.delete(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  deleteAssignment,
);
router.post("/generate", generateAssignments);

export default router;
