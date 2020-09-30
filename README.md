Dev Patel
https://a3-dev4848.herokuapp.com/

## Homework To-Do List

The goal of this project is to provide a simple to-do list application for the user built using the node.js server framework(express), a database(mongodb), and a CSS framework (bootstrap). The user just has to name the homework, what subject it was for, and the date it is due; they can edit and delete the homeworks as well. I chose to use the Github authentication strategy because it seemed to be the easiest to implement. I used Bootstrap because it is really popular and I had heard about it before, plus it seemed really easy to implement. One of the main challenges that surfaced was using the user id of the OAuth to make modifications to the database. I didn't know how to quite connect the two, but I was able to solve the issue by using sessions.

Changes I made after submitting : I used cookie sessions to keep the users sessions in place and used bootstrap classes to update the UI.

The 5 express middleware packages I used were:
-PassportJS: Authentication middleware for Node.js and it includes Github & local strategies.
-Serve-Favicon: Sets a favicon for app's pages
-Helmet: Sets HTTP headers that protect your website
-Cookie-session: Keeps users logged in across sessions using a cookie issuance based on their user ID
-Bodyparse: I used bodyparse to avoid having to parse all responses into json (which saved me a ton of redundant code across the backend endpoints)


## Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I hosted the website on heroku because it was an opportunity to learn how to host it on cloud based application platforms and it provides easy deployment through github where it will redeploy any time the master branch is pushed to.
