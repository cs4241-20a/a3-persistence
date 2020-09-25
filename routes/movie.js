const router = require("express").Router();

//callback github
router.post("/movie", (req, res) => {
    console.log(req.body);
});

module.exports = router;
