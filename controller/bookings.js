const Booking = require("../model/Booking");
const Company = require("../model/Company");

// @desc    Create booking
// @route   POST /api/v1/companies/:companyId/bookings
// @access  Private
exports.addBooking = async (req, res, next) => {
    try {
        req.body.company = req.params.companyId;
        req.body.user = req.user.id;

        // Check if company exists
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res
                .status(404)
                .json({ success: false, error: "Company not found" });
        }

        // Validate booking date is between May 10-13, 2022
        const bookingDate = new Date(req.body.bookingDate);
        const startDate = new Date("2022-05-10T00:00:00.000Z");
        const endDate = new Date("2022-05-13T23:59:59.999Z");

        if (bookingDate < startDate || bookingDate > endDate) {
            return res.status(400).json({
                success: false,
                error: "Booking date must be between May 10th - 13th, 2022",
            });
        }

        // Check if user already has 3 bookings
        const existingBookings = await Booking.find({ user: req.user.id });
        if (existingBookings.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                error: "You can only book up to 3 interview sessions",
            });
        }

        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
