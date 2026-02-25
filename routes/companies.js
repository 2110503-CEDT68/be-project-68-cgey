const express = require("express");
const {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
} = require("../controllers/companies");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Re-route into booking router for nested route
const bookingRouter = require("./bookings");
router.use("/:companyId/bookings", bookingRouter);

router
    .route("/")
    .get(getCompanies)
    .post(protect, authorize("admin"), createCompany);

router
    .route("/:id")
    .get(getCompany)
    .put(protect, authorize("admin"), updateCompany)
    .delete(protect, authorize("admin"), deleteCompany);

module.exports = router;
