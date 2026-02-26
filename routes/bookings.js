const express = require("express");
const { getBooking, addBooking, updateBooking, deleteBooking} = require("../controller/bookings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// Only POST to create a booking (requirement 3)
router.route('/')
    .post(protect, authorize('admin','user'), addBooking);

router.route('/:id')
    .get(getBooking)
    .put(protect, authorize('admin'), updateBooking)
    .delete(protect, authorize('admin'), deleteBooking);

module.exports = router;
