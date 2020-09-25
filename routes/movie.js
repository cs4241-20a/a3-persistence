const router = require("express").Router();
const Movie = require("../models/movie-model");
const passport = require("passport");

//callback github
router.post("/movie/add", (req, res) => {
    console.log(req.body);
    Movie.findOne({ movieName: req.body.movieName, userID: req.user }).then(
        (currentMovie) => {
            if (currentMovie) {
                console.log("current movie:", currentMovie);
                if (currentMovie.seen != req.body.seen) {
                    Movie.updateOne(
                        { movieName: req.body.movieName, userID: req.user },
                        { seen: req.body.seen }
                    ).then((updatedMovie) => {
                        console.log("updated movie:", updatedMovie);
                    });
                }

                res.end("ok");
            } else {
                new Movie({
                    movieName: req.body.movieName,
                    seen: req.body.seen,
                    userID: req.user,
                })
                    .save()
                    .then((newMovie) => {
                        console.log("new movie:", newMovie);
                        res.end("ok");
                    });
            }
        }
    );
});

router.post("/movie", (req, res) => {
    res.send(req.user);
});

module.exports = router;
