Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

WEBSITE - https://a3-ivan-eroshenko.herokuapp.com

## Handy-Dandy Running Tracker

your glitch (or alternative server) link e.g. https://a3-ivan-eroshenko.herokuapp.com

This is a project to track your runs. You can enter # miles, your speed and calculate how many calories you burnt. Also, update / delete previous runs

- Track your runs
- Took a bit of time to realize how to implement GitHub Oauth. As well as because I used CSS templates, it was also unusual for me and struggled with adding new fields to previous entries
- GitHub OAuth. I wanted to get extra points!
- materialize. I was following a guide on YouTube and so the guy used materialize.
  - Modifications to the template can be found in public/stylesheets/style.css
- Express Middleware Packages:
  - morgan - log requests in console
  - exphbs - to use handle bars (motivated by a YouTube guide)
  - express-session - to store user session in Database
  - connect-mongo - to store user session in Database
  - method-override - since I used html form to make POST/PUT/DELETE requests (not front end javascript), this middleware allowed me to have PUT/DELETE headers
  - errorhandler - I tried to launch it, but it didn't work :()
  - Passport.js - GitHub Auth

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I deployed the app to heroku - https://a3-ivan-eroshenko.herokuapp.com. I made this project entirely in glitch at first and realized that glitch is super annoying. Heroku seemed to be more professional to me because of all those CL tools. But in the same time a bit "harder" or rather will take more time to realize its full potential.

### Design/Evaluation Achievements
- None
