const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc auth with github
// @route GET /auth/github
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// @desc github auth callback
// @route GET /auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/home");
  }
);

// @desc logout user
// @route GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

module.exports = router;
