# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
---

https://glitch.com/~hezi-k-a3

## WPI Football

WPI Football is a simple website that allows users to login and manage a team sheet. This is an updated version of the A2 project. 

## Baseline Requirements

- **Node.js server:** Built a server that relies on the express framework to handle communication between the client and the server. The server connects to MongoDB to store user information
- **Results:** When the user submits the form, their entry is reflected in the results table to the right
- **Form Entry:** The user is able to add, edit and delete data by using the appropiate buttons 
- **Middleware Packages:**
  * Passport: Used to implement secure authentication via the github login strategy
  * Helmet: Used to add HTTP headers to improve security of the website
  * Response Time: Used to track the response time of every request
  * Morgan: Logs the requests to the terminal, this was very helpful when debugging
  * Body Parser: Used to parse all the bodies in the requests that the client received
- **Persistent Data Storage:** When the user enters data, logs out or reloads the page their data will still be there. This was achieved with MongoDB
- **Use of CSS Framework:** I used 2 CSS frameworks. MUI was used for the buttons on the login page. Materialize was used for the results table and the buttons on the page as well
- **HTML:** I used a number of HTML tags. For user input specifically I used the input and select tags. Currently if the user logs in without github their data will be stored. However if they log in with 
github their data will not be stored. This is something that needs to be fixed
- **Javascript:** Javascript was used to do things like display username, add button functionality and of course manage communication between the client and server

### Technical Achievements

**Node.js server:** I implemented the github strategy using the passport middleware. Currently the user is able to login with thei github, however I was unable to store the github user id in the
database. So currently the user can log in and add data but this data will not be persistent if the log in with github

