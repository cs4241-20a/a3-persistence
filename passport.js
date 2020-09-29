const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new GitHubStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: "https://a3-luke-deratzou.glitch.me/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));