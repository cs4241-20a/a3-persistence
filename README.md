## Your Web Application Title

Heroku: https://a3-nlingram.herokuapp.com/
(DRAWBACK: The login/home pages URL's are hard coded, so those will only work on either the localhost or Heroku, one at a time. For submission I made them work for Heroku, I wasn't able to figure out how to make this modular in time)

The application that I made is a continuation of my a2 project, a simple todo-list. This project has far improved and now offers OAuth2.0 with GitHub and better styling with Boostrap4.

Implementing Oauth 2.0 with GitHub proved to be challenging but after watching some tutorials online I was able to figure it out.
Using a get request to the site and GitHub's Oauth application page, I setup the callback site to be the home page of this website.

I choose to use Bootstrap for the css framework because I am partially familiar with it and it is easy to use. I used a custom gif in a styles.css file in addition to Boostrap.
This includes a different font and an ease of styling.

The five express middlewars that I used are :

- static: this allows the server to serve static files
- timeout: allos the server to set timeout periods inbetween HTTP requests
- morgan: logs HTTP requests
- body-parser: this will parse HTTP request body's, in this project to JSON files
- response-time: this will record the HTTP response time

This project also successfully uses MongoDB to add, update, and delete todo items.
All of the data is persistant as well and be seen in real time being updated on the client and the database.

## Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I uploaded my project to Heroku instead of Gltich
