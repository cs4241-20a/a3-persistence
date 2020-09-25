const router = require("express").Router();
const passport = require("passport");

// login github
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["profile"],
    })
);

// logout
router.get("/logout", (req, res) => {
    res.send("logout");
});

//callback github
router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
    // res.send(req.user);
    res.redirect("/");
});

module.exports = router;
