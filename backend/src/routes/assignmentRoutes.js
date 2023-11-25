import express from "express";
import {
    createAssignment,
    deleteAssignment,
    getAssignment,
    getAssignments,
    updateAssignment,
} from "../controllers/assignmentController.js";

import {jwtTokenAuthentication, requireRole,} from "../config/security/jwtTokenAuthentication.js";
import {upload} from "../config/multer.js";

const router = express.Router();

router.post(
    "/",
    upload.array("attachments", 10),
    jwtTokenAuthentication,
    requireRole("professor"),
    createAssignment
);
router.get("/:id", jwtTokenAuthentication, getAssignment);
router.get("/", jwtTokenAuthentication, getAssignments);
router.put(
    "/:id",
    upload.array("attachments", 10),
    jwtTokenAuthentication,
    requireRole("professor"),
    updateAssignment
);
router.delete(
    "/:id",
    jwtTokenAuthentication,
    requireRole("professor"),
    deleteAssignment
);

export default router;
