import express from "express";

import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController.js";

import {
  jwtTokenAuthentication,
  requireRole,
} from "../core/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
  "/",
  jwtTokenAuthentication,
  requireRole("professor"),
  createSubject,
);
router.get("/:id", jwtTokenAuthentication, getSubject);
router.get("/", jwtTokenAuthentication, getSubjects);
router.put(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  updateSubject,
);
router.delete(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  deleteSubject,
);

export default router;
