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

// @desc    Get bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let bookings;

    // ถ้าเป็น admin ดูได้ทั้งหมด
    if (req.user.role === "admin") {
      bookings = await Booking.find().populate("company");
    } 
    // ถ้าเป็น user ดูได้แค่ของตัวเอง
    else {
      bookings = await Booking.find({ user: req.user.id })
                              .populate("company");
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    // 🔥 เช็คสิทธิ์
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ success: false });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    // 🔥 เช็คว่าเป็นเจ้าของไหม
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ success: false });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
