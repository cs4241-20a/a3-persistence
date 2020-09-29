Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Golf Club Tracker V2

Matt Tolbert (mmtolbert@wpi.edu)
link: http://a3-matt-tolbert.glitch.me

- The goal of this application is to allow users to keep track of their golf bag by club distance and swing speed (calculated automatically). These changes are stored persistently across sessions using cookies.
- Implementing OAuth and connecting with MongoDB both presented some significant challenges. Namely Oauth in general, and MongoDB in keeping track of the information locally and ensuring that it is up to date in the database as well.
- I implemented OAuth using github as I found several useful tutorials that helped me to get a better understanding of how it worked and how to implement it.
- I used the Tacit CSS framework (https://yegor256.github.io/tacit/)
  - I did not make many significant modifications to it other than to center the headers and input inform
  - I'm not very satisfied with the limited amount of customization that this framework and the other drag and drop frameworks offered. All things considered, I definitively would not have used one if it was not a requirement as I preferred the CSS styling that I wrote by hand last week. That being said, I followed the directions as required and did not have any trouble implementing this part of the assignment.
- Express middleware packages
  - Express.static - I used static to automatically serve the static files from my public folder so they are accessible from all pages.
  - cookie-session - I used cookie-session in order to keep users logged in across sessions using a cookie issuance based on their user ID
  - custom db connection middleware - I used a custom middleware to verify that MongoDB was connected properly on all transactions
  - bodyparse - I used bodyparse to avoid having to parse all responses into json (which saved me a ton of redundant code across the backend endpoints)
  - compression - I used the compression middleware to reduce the size of transactions assuming they did not set a flag to request no compression

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- For this achievement I followed a tutorial from Kevin Simper @
https://www.kevinsimper.dk/posts/how-to-make-authentication-with-github-apps-for-side-projects

### Design/Evaluation Achievements
- None
