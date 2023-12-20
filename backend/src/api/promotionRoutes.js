import express from "express";

import {
  createPromotion,
  deletePromotion,
  getPromotion,
  getPromotions,
  updatePromotion,
} from "../controllers/promotionController.js";

import {
  jwtTokenAuthentication,
  requireRole,
} from "../core/security/jwtTokenAuthentication.js";

const router = express.Router();

router.post(
  "/",
  jwtTokenAuthentication,
  requireRole("professor"),
  createPromotion,
);
router.get("/:id", jwtTokenAuthentication, getPromotion);
router.get("/", jwtTokenAuthentication, getPromotions);
router.put(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  updatePromotion,
);
router.delete(
  "/:id",
  jwtTokenAuthentication,
  requireRole("professor"),
  deletePromotion,
);

export default router;
