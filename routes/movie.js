const router = require("express").Router();
const Movie = require("../models/movie-model");
const passport = require("passport");

const ID = 69;
//callback github
router.post("/movie/add", (req, res) => {
    console.log(req.body);
    Movie.findOne({
        movieName: req.body.movieName,
        userID: req.user.githubID,
        // userID: ID,
    }).then((currentMovie) => {
        if (currentMovie) {
            console.log("current movie:", currentMovie);
            if (currentMovie.seen != req.body.seen) {
                Movie.updateOne(
                    {
                        movieName: req.body.movieName,
                        userID: req.user.githubID,
                        // userID: ID,
                    },
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
                userID: req.user.githubID,
                // userID: ID,
            })
                .save()
                .then((newMovie) => {
                    console.log("new movie:", newMovie);
                    res.end("ok");
                });
        }
    });
});

router.get("/movie", (req, res) => {
    Movie.find({ userID: req.user.githubID }, function (err, movies) {
        if (err) {
            res.send(err);
        }
        res.json(movies);
    });
});

module.exports = router;
