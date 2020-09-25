const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const User = require("../models/User");


// @desc get number of users
// @route GET /users/quantity
router.get("/quantity", ensureAuth, async (req, res) => {
  try {
    User.countDocuments({}, (err, count) => {
      let actualCount = count - 1; // since we don't wanna count ourselves
      res.json({count: actualCount});
    });
  } catch (e) {
    console.log(e);
    res.send("404. Sorry, something went wrong when loading number of fellow runners");
  }
});



module.exports = router;
