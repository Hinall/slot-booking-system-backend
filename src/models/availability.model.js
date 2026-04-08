import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [ true, "User is required" ],
        },
        date: {
            type: String,
            required: [ true, "Date is required" ],
        },
        startTime: {
            type: String,
            required: [ true, "Start time is required" ],
        },
        endTime: {
            type: String,
            required: [ true, "End time is required" ],
        },
    },
    { timestamps: true }
);

const availabilityModel = mongoose.model("Availability", availabilitySchema);

export default availabilityModel;
