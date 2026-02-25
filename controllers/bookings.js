const Booking = require("../model/Booking");
const Company = require("../model/Company");

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Private
exports.getBookings = async (req, res) => {
    let query;
    const baseQuery = {};

    // If accessing via nested route /companies/:companyId/bookings
    if (req.params.companyId) {
        baseQuery.company = req.params.companyId;
    }

    // Regular users can only see their own bookings; admins can see all
    if (req.user.role !== "admin") {
        baseQuery.user = req.user.id;
    }

    query = Booking.find(baseQuery)
        .populate({
            path: "company",
            select: "name address website description tel",
        })
        .populate({
            path: "user",
            select: "name email tel",
        });

    try {
        const bookings = await query;
        res
            .status(200)
            .json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Cannot get bookings" });
    }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: "company",
                select: "name address website description tel",
            })
            .populate({
                path: "user",
                select: "name email tel",
            });

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }

        // Regular users can only view their own bookings
        if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized to view this booking" });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Cannot get booking" });
    }
};

//@desc Add interview session booking
//@route POST /api/v1/companies/:companyId/bookings
//@access Private
exports.addBooking = async (req, res, next) => {
    try {
        req.body.company = req.params.companyId;

        // Check if company exists
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res
                .status(404)
                .json({ success: false, message: "Company not found" });
        }

        req.body.user = req.user.id;

        // Check if user already has 3 bookings (non-admin users limited to 3)
        const existingBookings = await Booking.find({ user: req.user.id });

        if (existingBookings.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message:
                    "The user with ID " +
                    req.user.id +
                    " has already made 3 interview bookings",
            });
        }

        const booking = await Booking.create(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ success: false, message: err.message });
    }
};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }

        // Make sure user is the booking owner or admin
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this booking",
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({ success: true, data: booking });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: err.message });
    }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }

        // Make sure user is the booking owner or admin
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this booking",
            });
        }

        await booking.deleteOne();
        return res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: err.message });
    }
};
