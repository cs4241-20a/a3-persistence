const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Run = require("../models/Run");

const calculateCalories = (miles, mph) => {
  return miles * 100 + mph * 3;
};

// @desc add new run
// @route PUT /runs
router.put("/", ensureAuth, async (req, res) => {
  try {
    let miles = parseInt(req.body.miles);
    let mph = parseInt(req.body.mph);
    let calories = calculateCalories(miles, mph);
    let notes = req.body.notes;

    let run = {
      user: req.user.id,
      miles: miles,
      mph: mph,
      notes: notes,
      caloriesBurnt: calories
    };

    await Run.create(run);
    res.redirect("/home");
  } catch (e) {
    console.log(e);
    res.send("404. Sorry, you didn't specify number of miles and your speed")
  }
});

// @desc update existing run if any
// @route PUT /runs/update
router.put("/update", ensureAuth, async (req, res) => {
  try {

    let runId = req.body.id;

    const run = await Run.findOne({ _id: runId });

    if (run) {
      if (req.body.miles.length) {
        run.miles = parseInt(req.body.miles);
      }

      if (req.body.mph.length) {
        run.mph = parseInt(req.body.mph);
      }

      run.caloriesBurnt = calculateCalories(run.miles, run.mph);

      if (req.body.notes.length) {
        run.notes = req.body.notes;
      }

      await run.save();
    }

    res.redirect("/home");
  } catch (e) {
    console.log(e);
    res.redirect("/home");
  }
});

// @desc delete existing run
// @route DELETE /runs/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const run = await Run.deleteOne({ _id: req.params.id });
    res.redirect("/home");
  } catch (e) {
    console.log(e);
    res.redirect("/home");
  }
});

module.exports = router;
