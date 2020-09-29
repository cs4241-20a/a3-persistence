Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Game High Scores 2.0!

https://a3-matthew-gulbin.herokuapp.com/
Matthew Gulbin

The goal of my application was tocreate a system that allowed users to sign in via Github and input scores they got in a certian video game, which would be stored in a database.

One of the challenges I faced in realizing my application was implementing the edit and delete data features. I was unable to complete this because I had trouble dynamically creating onclick events for the HTML buttons within the table I used to display the data. However, I did write server-side code that should (theoretically) delete and modify data within the database.

I chose to implement the Github authentication strategy because of the easy to read documentation on Passport's website.

For my CSS framework, I used Tacit because it looks clean and does not use any CSS classes, making it very easy to integrate. I did not make any modifications to this CSS framework.

The five Express middleware packages I used were:
- body-parser - parses json from HTTP requests
- passport - allows users to login and access their personal data
- express-session - remembers the user throughout the session
- morgan - logs HTTP requests, which is very helpful for debugging
- response-time - records the HTTP response time

## Technical Achievements
- **Implemented OAuth authentication**: I used OAuth authentication via the GitHub strategy
- **Hosted site on Heroku**: Heroku required a little bit more setup than Glitch, but the ability to automatically deploy the site from a specified Github branch was very useful. The one feature of Heroku's that I disliked was the hard to find application logs.
