---

## To Do List

link to project: https://a3-ninat-taurich.glitch.me

- The goal of this application is to create a to do list for the user. They can add tasks, delete tasks, and edit the status of each task
- To authenticate the user I created a page where they could input a username. This username is stored as a cookie. Only the tasks associated with the user logged in will be displayed. This seemed like it would be the easiest to implement but I had a lot of complications with cookies not showing in the glitch preview and understanding how to use cookies.
- css framework: I used milligram because it was simple and effective 
- middleware
  - body-parser: converts the request.body to a json format
  - cookie-parser: stores the username as a cookie
  - compression: compresses the response
  - response-time: adds a response field to the header
  - I used it to check the connection with mongoDB

## Technical Achievements
- none
### Design/Evaluation Achievements
- none
