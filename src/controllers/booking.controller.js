import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import BookingLink from "../models/bookingLink.model.js";
import Availability from "../models/availability.model.js";
import Visitor from "../models/visitor.model.js";
import userModel from "../models/user.model.js";
import { generateSlots } from "../utils/slotGenerator.js";

async function buildAvailabilityResponse(userId, date) {
    const availability = await Availability.find({ userId, date });

    let allSlots = [];

    availability.forEach((a) => {
        const slots = generateSlots(a.startTime, a.endTime);
        allSlots.push(...slots);
    });

    const bookings = await Booking.find({
        userId,
        date,
    }).populate("visitorId", "name email");

    const availableSlots = allSlots.filter(
        (slot) =>
            !bookings.some(
                (b) => b.startTime === slot.start && b.endTime === slot.end
            )
    );

    return { availableSlots, bookings };
}

export async function getBookings(req, res) {
    try {
        const { slug } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "date query parameter is required" });
        }

        const link = await BookingLink.findOne({ slug });
        if (!link) return res.status(404).json({ message: "Invalid link" });

        const userId = link.userId;

        const { availableSlots, bookings } = await buildAvailabilityResponse(
            userId,
            date
        );

        res.json({
            availableSlots,
            bookings,
        });
    } catch (error) {
        console.error("getBookings:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getBookingsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "date query parameter is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const host = await userModel.findById(userId);
        if (!host) {
            return res.status(404).json({ message: "User not found" });
        }

        const { availableSlots, bookings } = await buildAvailabilityResponse(
            userId,
            date
        );

        res.json({
            availableSlots,
            bookings,
        });
    } catch (error) {
        console.error("getBookingsByUserId:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function bookSlot(req, res) {
    try {
        const { userId, date, startTime, endTime, name, email } = req.body || {};

        if (!name || !email) {
            return res.status(400).json({ message: "Visitor details required" });
        }

        if (!userId || !date || !startTime || !endTime) {
            return res.status(400).json({
                message: "userId, date, startTime, and endTime are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const host = await userModel.findById(userId);
        if (!host) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = await Booking.findOne({
            userId,
            date,
            startTime,
            endTime,
        });

        if (exists) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        let visitor = await Visitor.findOne({ email: email.trim().toLowerCase() });
        if (!visitor) {
            visitor = await Visitor.create({
                name: name.trim(),
                email: email.trim().toLowerCase(),
            });
        }

        const booking = await Booking.create({
            userId,
            visitorId: visitor._id,
            date,
            startTime,
            endTime,
        });

        const populated = await Booking.findById(booking._id).populate(
            "visitorId",
            "name email"
        );

        res.json({
            message: "Booking successful",
            booking: populated,
        });
    } catch (error) {
        console.error("bookSlot:", error);
        res.status(500).json({ message: "Server error" });
    }
}
