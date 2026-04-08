import userModel from "../models/user.model.js";
import Availability from "../models/availability.model.js";
import mongoose from "mongoose";

export async function getAllUsers(req, res) {
    try {
        const hasAvailability =
            req.query.hasAvailability === "true" || req.query.hasAvailability === "1";

        let query = {};
        if (hasAvailability) {
            const ids = await Availability.distinct("userId");
            query = { _id: { $in: ids } };
        }

        const users = await userModel.find(query).select("username email").lean();

        const mapped = users.map((u) => ({
            _id: u._id,
            username: u.username,
            email: u.email,
            name: u.username,
        }));

        res.json(mapped);
    } catch (error) {
        console.error("getAllUsers:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getUserById(req, res) {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const user = await userModel.findById(userId).select("username email").lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.username,
        });
    } catch (error) {
        console.error("getUserById:", error);
        res.status(500).json({ message: "Server error" });
    }
}
