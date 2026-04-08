import express from "express";
import {
    bookSlot,
    getBookings,
    getBookingsByUserId,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", bookSlot);
router.get("/by-user/:userId", getBookingsByUserId);
router.get("/:slug", getBookings);

export default router;
