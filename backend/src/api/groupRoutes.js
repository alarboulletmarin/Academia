import express from "express";
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
} from "../controllers/groupController.js";

import {
  jwtTokenAuthentication,
  requireRole,
} from "../core/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post("/", jwtTokenAuthentication, requireRole("professor"), createGroup);
router.get("/:id", jwtTokenAuthentication, getGroup);
router.get("/", jwtTokenAuthentication, getGroups);
router.put(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  updateGroup,
);
router.delete(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  deleteGroup,
);

export default router;
