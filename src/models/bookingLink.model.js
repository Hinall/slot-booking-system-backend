import mongoose from "mongoose";

const bookingLinkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [ true, "User is required" ],
        },
        slug: {
            type: String,
            unique: true,
            required: [ true, "Slug is required" ],
        },
    },
    { timestamps: true }
);

const bookingLinkModel = mongoose.model("BookingLink", bookingLinkSchema);

export default bookingLinkModel;
