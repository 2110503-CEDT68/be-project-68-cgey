const company = require("../model/Company");

//@desc Get all companies
// @route GET /companies
// @access Public
exports.getCompanies = async (req, res) => {
    try {
        const companies = await company.find();
        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.creatcompanes = async (req, res) => {
    try {
        const companies = await company.create(req.body);
        res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};