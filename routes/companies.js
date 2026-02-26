const express = require("express");
const {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
} = require("../controller/companies");

// Include booking router for re-routing
const bookingRouter = require("./bookings");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Re-route into booking router
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
