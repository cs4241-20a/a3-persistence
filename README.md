Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## Simple Day Planner

Malek ElShakhs Assignment 3: https://glitch.com/~a3-malek-elshakhs

I created a simple daily planner with authentication, I use my outlook calendar non-stop so it would be interesting to create something similar, however the time and scope of this project falls short of that so I settled on just having it plan for a day. The way the authentication works is if a user does not exist yet, it will create a new account, but if the username is taken then the password provided must be correct otherwise an error will come up. All meetings are associated with the user who created them and cannot be seen or changed by anyone else. All authentication was done just with mongodb as I attempted to use oauth as well but was thwarted by glitch (it doesn't like outside webpages I believe). I fully implemented adding, deleting, and modifying meetings (to modify, you have to enter fields in the form and then hit the update button next to a meeting). I used bootstrap with a template for my app since I believe it looks good and has a nice minimalist design. My own css was just to space out the elements nicely so they weren't bunched up in the top right of the page. For my five express middleware, I used body-parser to parse incoming requests into a json object, I used helmet to secure my app, I used morgan for simple and quick HTTP request logs, I used compression to compress HTTP responses, and I used github-oauth-express to try to enable oauth through github (however this didn't work due to glitch's Content Security Policy).

## Technical Achievements
- **Tech Achievement 1**: I attempted to use the OAuth authentication via the GitHub strategy using github-oauth-express, which I believe I implemented correctly, however, glitch logs an error in the console: 

      Refused to frame 'https://github.com/' because it violates the following Content Security Policy directive: 
      "frame-src 'self' https://*.glitch.me https://*.glitch.staging.me https://*.glitch.development 
      https://*.testing.staging.glitch.com https://accounts.google.com 
      https://content-firebase.googleapis.com/ https://www.google.com blob: data:".
  
  So I cannot actually use it within glitch, however, if I copy the href link I used into a separate window, it successfully brings me to the github oauth page for my app. If I    had more time I would have tried deploying my project to heroku instead to see if my oauth actually worked or not.

### Design/Evaluation Achievements
- None
