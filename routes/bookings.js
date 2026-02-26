const express = require("express");
const {
  addBooking,
  getBookings,
  updateBooking,
  deleteBooking
} = require("../controller/bookings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// 🔹 GET all bookings (ของตัวเอง หรือ admin เห็นหมด)
router
  .route("/")
  .get(protect, authorize("admin", "user"), getBookings)
  .post(protect, authorize("admin", "user"), addBooking);

// 🔹 UPDATE & DELETE booking ตาม id
router
  .route("/:id")
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;