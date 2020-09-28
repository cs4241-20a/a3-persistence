Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## TODO - Task Management Application

https://a3-hunter-trautz.herokuapp.com/

- I created a simple TODO application which allows you to make an account and create new individual tasks that have a name, description, priority, and due date.
- After being authenticated on the application's login page users are then redirected to the homepage
- Due dates are automatically generated for each task based on the priority that was entered and you are able to delete tasks by pressing the 'Delete' button associated with it.
- Tasks can be updated by entering new information in the input fields and then pressing the update button next to the task you want to update
- Utilized flexboxes to ensure that the UI of the application scales to the user's web browser
- Tasks are stored on a MongoDB instead of on local machine
- Tasks are now associated with user accounts which are also stored on MongoDB
- Login with GitHub supported


## Baseline Requirements

Server:
- Created using Express.js  
- Dataset is displayed in a table below the form/entry fields on the homepage
- Users can add, delete, and modify individual tasks associated with their accounts
- Utilized MongoDB for persistent database

Express Middleware Packages:
- server-static: Used to automatically server all files stored in my public directory
- morgan: Used to log server traffic to the console and information about the client's machine
- body-parser: Used so that I would not have to manually parse each JSON object provided in network requests
- passport: Used for GitHub OAUTH login
- connect-timeout: Used to automatically times out express http requests lasting more than 5s  

HTML:
- Used a form with <input> and <select> tags to take in data from each user
- Data that is displayed on the homescreen is specific to that particular authenticated user  

CSS:
- I did not implement a CSS framework

JavaScript:
- JS is used throughout the application to get/fetch data from the the homepage as well as the login page.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy (passport.js library). However users that do not have a GitHub can still test with the dummy account "username" and "password"
- **Tech Achievement 2**: I used Heroku to host my site instead of Glitch. After using it, I definitely prefer it because of the automatic GitHub deployments, the ability to easily set/change environment variables, and access to the Heroku CLI.
