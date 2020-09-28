Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Jordan Stoessel

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

--- 
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 
---

## Speed Clicker 2.0


your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me


Speed Clicker is a game where you can input an amount of time to play and see how fast you can click. Over the time limit the user's click count is tallied till time is elapsed. At this point, the user may type in their name to be uploaded into the database. For assignment 3, the user would be automatically registered based on the authentication login over a unique username. This didn't work as planned as such I left the code mostly intact but reverted it to it's original functionality. The issue I had with implementing authentication was maintaining a secure authentication along with bcrypt and  obscurity with passcodes. I figured out how to compare hash to password, but for some reason it would continuously always compare to be true. I chose to use passport for authentication along with bcrypt for encryption simply because that was the documentation I was reading into. I chose Bootstrap as my CSS framework because that was the most popular one along with the fact that I was wanting to try it for a while. I found it to be quite interesting with how seamlessly the webpage moves now. The only edits I made to the CSS files were the centering of just about everything along with color/marginal changes. Nothing too heavy. I made use of body-parser, passport's Authenticate, next, checkAuthenticate, and checkNotAuthenticate. body-parser was used because of the tutorial video in class which became helpful for auto parsing the JSON body information for easier handling. passport's authenticate middleware was used to enable local authentication for handling usernames and passwords (this worked till associated with the mongodb database). The next middleware function used was next which makes use of the next function/line within the code: This was useful for processing without messing with the request-response cycle. The last two middlewares that were used were defined to check if the user was authenticated (logged in) or not. These two worked by essentially enabling and disabling '/login', '/register', and '/' depending on if the user was already logged in or not. This was done by redirecting the user to the correct location until logged in or out. I seemed to have struggled on this particular project and as such I will work to understanding how to better organize my code to correctly implement authentication along with the database. Mongodb worked flawlessly. The issue came from connecting the server script's authentication process to mongodb itself for identifying a user. The code still shows most of the ideas I had for this implementation where had it have worked the last requirement I needed would have been removing username input and replacing it with the login username for '/submit', '/delete', and '/modify'.

## Technical Achievements
- **Tech Achievement 1**: I made use of passport to handle usernames and passwords as a unique idenifier and user authenticator. Initializing passport became an issue when converting from array to database therefore I was forced to revert some changes before submission.

- **(Actual) Tech Achievement 2**: I uploaded my project to Heroku instead of glitch. I received a lot of issues originally from accidentally uploading my node_modules folder.

### Design/Evaluation Achievements
- **Design Achievement 1**: I made use of bcrypt to securely encrypt passwords before uploading into the mongodb user database. The idea in doing so was for allowing users to create accounts and login to automatically add themselves to the leaderboard. The most confusing part to deal with in bcrypt was making use of the compare function.
