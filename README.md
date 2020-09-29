Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

Author: Abhijay Thammana

Demo: https://a3-athammana.herokuapp.com/

---

## Unscramble v2!


Unscramble v2!
	The app differs from the first one because of the sign in ability and the connection to a databse. Now you can verse your friends or other strangers if you don't have any. The website opens up to a login page that offers your three options. You can create an account, sign in with your preexisting username and password, or sign in with your github account. Once you are logged in the app handles all the backend work for you. It carries your identifying information (Username) and assigns it to an id so it can be unique in all of the app's database. The database has 3 tables. One table handles the current word for a given person. One handles all of the scores, in progress ones are tied to an id, while others are not. And lastly a table with all the user information. All accounts, including github oauth accounts, have a username, id, and a encrypted password. Every call made to the database is through the server. 

Goal
	The application basically works as a standalone app that anyone can sign in, and then try to beat the high score in Unscramble! to get their name to the top of the leaderboard. The premis is pretty simple, but there are a decent amount of nuances involved in the app.

Challenges
	I had a lot of trouble porting my application form a3 into one that uses a database. The old was and is very messy. The database access was also a bit hard, because there were a lot of promises involved as well as MongoClient.Connects. I also kept running into bugs that I didn't understand because of all the new technologies I used, like a database, oauth and a css framework. All of those were new for me so it was definitely a slow learning curve.

Authentication
	I chose to challenge myself. I went with both oauth, a username password thing, and bcrypt to secure the passwords. I chose the oauth because of the extra points, the username and password because I wanted to see if I could actually make a username password system. It was easier that I thought, I was not able to do any crazy authentication on the main page to make sure you're are logged in or something though.

CSS framework
	I chose to go with the framework 'Materialize', because it contains an easy enough way to work with grids. It also contains a lot of components that add a lot to the webpages functionality. It also makes everything look better. For extra styles, I added a background with a couple svg blobs from 'https://www.blobmaker.app/' and I also set the font size and family to make sure it was constant. There was also a need for an incorrect class that turned the text red, and an on focus class that made the text plum because its my favorite color. I also added some inline styles for the main input field, because it was making it look horrible without them.


Express Middleware Packages
	- Body-Parser: Parse the request bodies beforethey come into the handler functions so you can actually read them
	- CORS: Enables: CORS so you can safely make requests to outside domains
	- ErrorHandler: Gives a function that logs the errors and sends a request with an error http code
	- Serve-Favicon: Sets a favicon for app's pages
	- Helmet: Sets a ton of HTTP headers that protect your website from evil hackers and stuff

## Technical Achievements
- **Tech Achievement 1**: I used Oauth via the Github Strategy. I didn't use the library because it seemed complicated, but I just processed the callback and kept the access token with the user
- **Tech Achievement 2**: I hosted my app on heroku. This was SIGNIFICANTLY better. Heroku is actually a godsend. Everything was easier that glitch, and you can do it all from the terminal. Also it doesn't look like it puts my webpage to sleep after a long period of inactivity.

### Design/Evaluation Achievements
- **Design Achievement 1**: I think I followed all the tips from the website. My website doesn't really have any pictures or crowded text, so it is pretty simple to complete the desired tasks.
- **Design Achievement 2**: Didn't do this 
