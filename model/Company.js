const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        address: { type: String, default: "" },
        website: { type: String, default: "" },
        description: { type: String, default: "" },
        tel: { type: String, default: "" },
    },
    { timestamps: true },
    { toJSON: { virtuals: true } },
    { toObject: { virtuals: true } }
);
CompanySchema.virtual("bookings", {
    ref: "Booking",
    localField: "_id",
    foreignField: "companies",
    justOne: false,
});
module.exports = mongoose.model("Company", CompanySchema);