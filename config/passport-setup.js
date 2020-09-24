const passport = require("passport");
const GithubStrategy = require("passport-github");
const config = require("config");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

const clientID =
    process.env.NODE_ENV === "production"
        ? process.env.clientID
        : config.get("clientID");

const clientSecret =
    process.env.NODE_ENV === "production"
        ? process.env.clientSecret
        : config.get("clientSecret");

passport.use(
    new GithubStrategy(
        {
            clientID,
            clientSecret,
            callbackURL: "/auth/github/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ githubID: profile.id }).then((currentUser) => {
                if (currentUser) {
                    console.log("current user:", currentUser);
                    done(null, currentUser);
                } else {
                    new User({
                        githubID: profile.id,
                        username: profile.username,
                    })
                        .save()
                        .then((newUser) => {
                            console.log("new user:", newUser);
                            done(null, newUser);
                        });
                }
            });
        }
    )
);
