const mongoose = require("mongoose");
const User = require("../model/User");

//@desc Register a new user
// @route POST /auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
    console.log(`User ${user._id} registered successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
