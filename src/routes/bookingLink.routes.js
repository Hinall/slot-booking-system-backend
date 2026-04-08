import express from "express";
import { generateLink, getLinkBySlug } from "../controllers/bookingLink.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, generateLink);
router.get("/:slug", getLinkBySlug);

export default router;
