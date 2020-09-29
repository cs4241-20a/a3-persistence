Webware A3-Persistence
Adam Desveaux 9/26/20
https://a3-adam-desveaux.glitch.me/

Baseline Requirements:
Server - express server
Results - shows current data for the logged in user
Form/Entry - users can add, modify, and delete from their own data
Express Middleware Packages:
-server-static: Serves static files
-passport: handles authentication
-helmet: adds security for http requests on the server
-errorhandler: adds additional error handling functionality I used when debugging
-body-parser: makes it easier to convert text received via http into json objects
Persistent data storage - mongodb is used to store all data
CSS framework: water.css
HTML text and number input fields are used.
Data for each authenticated user is displayed after login.
CSS: All CSS is done by water.css
JavaScript: Javascript was used for functionality throughout the application.
Node.js: An express server was used with 5 pieces of express middleware and a mongodb database.

The application presents an intuitive and easy to use todo list, with authentication functionality and a persistent
database.  I chose to use local authentication with plaintext because github integration was a lot more difficult than
I had expected, and I could not get it to work correctly.  I used the water.css framework because I like the dark
colors and simple aesthetic.  See above for description of middleware.  I did not do any achievements because the
authentication and mongodb connection parts of the assignment took much longer than I expected.  (I tried to deploy
using heroku but kept getting strange errors)