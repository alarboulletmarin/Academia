import express from "express";

import {
    createProfessor,
    deleteProfessor,
    getProfessor,
    getProfessors,
    updateProfessor,
} from "../controllers/professorController.js";

import {jwtTokenAuthentication, requireRole,} from "../config/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
    "/",
    jwtTokenAuthentication,
    requireRole("professor"),
    createProfessor
);
router.get("/:id", jwtTokenAuthentication, getProfessor);
router.get("/", jwtTokenAuthentication, getProfessors);
router.put(
    "/:id",
    jwtTokenAuthentication,
    requireRole("professor"),
    updateProfessor
);
router.delete(
    "/:id",
    jwtTokenAuthentication,
    requireRole("professor"),
    deleteProfessor
);

export default router;
