## Class Tracker - Webware Assignment 3 (Alex Hunt)

Alex Hunt (amhunt@wpi.edu): https://a3-alexmhunt-a20.glitch.me/

A simple application that allows users to keep a record of their classes and class times made with Node.js, Express, and MongoDB! Enter a 
Login authentication is handled through the server. Because of some mental health issues and real life getting in the way, I wasn't able to complete any achievements for this assignment.

- CSS Framework: I used [Picnic CSS](https://picnicss.com/) for my application because it was simple and lightweight, and I was able to implement it without having to install any packages.
- Express middleware packages:
  - Static: serves static files.
  - bodyparser: parses the body of JSON strings for use in the server.
  - response-time: keeps track of the response time for HTTP requests.
  - timeout: lets you specify a timeout for operations.
  - custom middleware to check the MongoDB connection and throw an error if no connection is found (see line 38 in server.js)

