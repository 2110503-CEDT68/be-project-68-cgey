const express = require("express");
const { addBooking } = require("../controller/bookings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// Only POST to create a booking (requirement 3)
router
    .route("/")
    .post(protect, authorize("admin", "user"), addBooking);

module.exports = router;
