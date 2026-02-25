const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a company name"],
            unique: true,
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        address: {
            type: String,
            required: [true, "Please add an address"],
        },
        website: {
            type: String,
            required: [true, "Please add a website"],
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                "Please use a valid URL with HTTP or HTTPS",
            ],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        tel: {
            type: String,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    },
);

// Reverse populate with virtuals - bookings associated with this company
CompanySchema.virtual("bookings", {
    ref: "Booking",
    localField: "_id",
    foreignField: "company",
    justOne: false,
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
