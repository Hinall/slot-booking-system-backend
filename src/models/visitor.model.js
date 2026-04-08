import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [ true, "Name is required" ],
        },
        email: {
            type: String,
            required: [ true, "Email is required" ],
        },
    },
    { timestamps: true }
);

const visitorModel = mongoose.model("Visitor", visitorSchema);

export default visitorModel;
