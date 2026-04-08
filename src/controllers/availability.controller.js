import Availability from "../models/availability.model.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";

export async function saveAvailability(req, res) {
    try {
        const { date, startTime, endTime } = req.body || {};

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "Invalid time range" });
        }

        const availability = await Availability.create({
            userId: req.user.id,
            date,
            startTime,
            endTime,
        });

        res.json(availability);
    } catch (error) {
        console.error("saveAvailability:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getMyAvailabilities(req, res) {
    try {
        const availabilities = await Availability.find({ userId: req.user.id })
            .sort({ date: 1, startTime: 1 })
            .lean();

        res.json(availabilities);
    } catch (error) {
        console.error("getMyAvailabilities:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getAvailableDatesForUser(req, res) {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const host = await userModel.findById(userId);
        if (!host) {
            return res.status(404).json({ message: "User not found" });
        }

        const dates = await Availability.distinct("date", { userId });
        dates.sort();

        return res.json(dates);
    } catch (error) {
        console.error("getAvailableDatesForUser:", error);
        res.status(500).json({ message: "Server error" });
    }
}
