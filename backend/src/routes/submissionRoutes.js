import express from "express";

import {
    createSubmission,
    deleteSubmission,
    getSubmission,
    getSubmissions,
    updateSubmission,
} from "../controllers/submissionController.js";

import {jwtTokenAuthentication, requireRole,} from "../config/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
    "/",
    jwtTokenAuthentication,
    requireRole("student"),
    createSubmission
);

router.get("/:id", jwtTokenAuthentication, getSubmission);
router.get("/", jwtTokenAuthentication, getSubmissions);
router.put(
    "/:id",
    jwtTokenAuthentication,
    requireRole("student"),
    updateSubmission
);
router.delete(
    "/:id",
    jwtTokenAuthentication,
    requireRole("student"),
    deleteSubmission
);

export default router;
