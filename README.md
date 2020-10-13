Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

by Ioannis Kyriazis

## Canvas Kicks Website

http://canvaskicks.store

This project is meant to be a place for an administrator to post items for sale. The administrator goes to /admin.html
to add, edit, and delete different posts in the database. A user can create an account or log in from /index.html.
The user is also able to view all the posts from there. I've faced many challenges trying to implement this idea. For one,
passport.js was very confusing to use and I still don't have the hang of it. I chose the username and password strategy
for passport.js. I used the water.css framework because it was the easiest to use. I used body-parser to make JSON parsing
easier. I used passport for implementing login. I used passport-local to implement the username/password strategy. I used 
express-session to have a log in session through passport. I used connect-flash to allow passportjs to work.

You can make an account by entering an unused username and password in the fields on the top of the site and clicking 
the register button. Then you can make comments that will be associated with your username. Then when you scroll to the
bottom you can press the submit button which shows you all the comments you've made.


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the username/password strategy.
- **Tech Achievement 2**: I migrated my code to heroku
- **Tech Achievement 3**: Used a .store TLD domain to access the heroku site

## Design Achievements
- **Design Achievement 1**: Modified css framework because button text had extra top padding


