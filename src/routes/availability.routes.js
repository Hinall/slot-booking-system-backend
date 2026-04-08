import express from "express";
import {
    getAvailableDatesForUser,
    getMyAvailabilities,
    saveAvailability,
} from "../controllers/availability.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getMyAvailabilities);
router.get("/dates/:userId", getAvailableDatesForUser);
router.post("/", authMiddleware, saveAvailability);

export default router;
