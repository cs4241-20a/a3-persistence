
## Project Manager Version 2


Author: Sean Morrissey
Link: https://a3-sean-morrissey.glitch.me/

## Project Summary
A User must create an account to be able to login, the WebApp handles if there is false information given by alerting the user.
Editing entries consists of hitting edit, filling out the appropriate text boxes and hitting done. Text areas left emtpy will keep what they had before.

- The goal of the application is to be able to manage a database of users and project based information that Users may contribute to via the WebApp.
- Some Challenges I faced:
  - Deciding whether to update last assignments application or start a new. I ended up deciding to reuse the application as it allowed me to focus in on the newer content from this assignment.
  - Transitioning to mongodb from server side database. This took me the most time throughout the project and I struggled with making sure the get/post requests would work as intended
  - Traversing pages via the server and not HTML. This was something that cause me a lot of trouble as for some reason the server would not recognize my files or the get requests associated with them.
- I chose the do a login page with local OAuth as my authentification method becuase it was what I knew I could accomplish given my schedule throughout the duration of the project. I also thought its a good start to learn about the strategy and its complexities
- I chose to use the Bootstrap CSS Framework. It is one of the most commonly used Frameworks so I thought it would be fun to get comfortable with it.
- Middleware Packages
  - body-parser : This package parses HTTP request bodys in amiddleware before any handlers, it creates a more manageable JSON object
  - response-time : This package records the HTTP response time of requests
  - helmet: This package adds more security to a Webapp by adding various headers such as contentSecurityPolicy
  - morgan: This package is an HTTP request logger.
  - passaport: This package is used for authenticating requests, this is what I used for my local OAuth authentication for logins.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the local strategy
