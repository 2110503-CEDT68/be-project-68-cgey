const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Allow only dates during May 10th-13th, 2022
                const start = new Date("2022-05-10T00:00:00.000Z");
                const end = new Date("2022-05-13T23:59:59.999Z");
                return value >= start && value <= end;
            },
            message: "Booking date must be between May 10th-13th, 2022",
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
