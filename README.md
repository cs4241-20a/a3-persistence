## A3-Isaac-Abouaf   To-do list app

Heroku App:  https://a3-isaac-abouaf.herokuapp.com/

The goal of this project is to provide a simple To-do list application for the user built using the Node.js server framework (express), a database (mongodb), and a CSS application framework / template of your choice (Boostrap). I chose to use the Github authentication strategy because it seemed to be the easiest to implement. I used the Bootstrap CSS framework because it seems to be incredibly popular and I wanted to learn how to use it in websites of my own. No substantial CSS modifications were made to the template other than setting a maximum and minimum width for the containers. One of the main challenges that surfaced was setting up the github authorization. I was receiving errors that the client was blocking post requests and it would prevent the authorization from working properly. Additionally, I struggled with using bootstrap at first due to the initial learning curve, but later came to find that it simplified the process in the end.

The 5 Express middleware packages I used:
- express.json(): Parses incoming requests with JSON payloads and is based on body-parser.
- session: express-session: Assigns a unique session to every user of the website, and this allows you to store the user state.
- PassportJS:  Authentication middleware for Node.js and it includes Github & local strategies.
- compression: Compresses response bodies.
- morgan: Allows one to easily log requests, errors, and more to the console.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy using passport.js
- **Tech Achievement 2**: I hosted the website on heroku because it was an opportunity to learn about alternate cloud based application platforms and it provides easy deployment through github where it will redeploy any time the master branch is pushed to.
