Simple Habit Tracker (v2)
===
Adrianna Staszewska

https://a3-adriannastaszewska.glitch.me/
https://simple-habit-tracker.herokuapp.com/

#### Goal: 
My project is a habit tracker. It's a tool that allows to track progress on a habit for a certain amount of weeks. When a grid is created it will be blank (all fields are grey) and the first cell in the grid represent today (highlighted with a grey border). User can track their progress on their goal by clicking on a cell. Click on a grey cell will result in the cell turing green (action done today), click on a green cell will make the cell red with represents a failure to complete the action. A click on a red cell makes the cell yellow which is meant to represents days on which an action didn't need to be completed (if a user wants to only do the action few times a week). Finally, a click on a yellow block will result the cell to come back to status quo (grey).
#### Challenges: 
I stuggled with implementing local authentication, and fillanly ended up implementing Github authentication. The process of encrypting and decrypting the password was a bit confusing to me. I tried to create a separate login page as well, but I had trouble with proper serving of the new html file. 
### Authentication: 
I implemented OAuth with passport.js. It seemed easier than having to save user accounts and hash passwords in the database. 
#### CSS Framwework: 
I chose mini.css. I liked the minimalism of this framework and it seems to suit the app well. I had to style the table myself. In retrosepct, I should've used a grid instead of table to show the progress on the goal. 
#### Express middleware:
  - express.static - serving static files (everything in 'public' folder)
  - body-parser - parse requests
  - serve-favicon - sets the favicon 
  - passport - used for Github authentication 
  - express-session - keeps user logged in for 24hours 
  
## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 1**: I hosted the application on Glitch, as well as Heroku. I did not like Heroku as much as Glitch because it was much less intuitive and does not have a build-in editor (or at least I didn't find it), so making any last-minute changes was much harder. However, what is better about Heroku is syncing with Github, so if I was developing locally, I think Heroku would be a good choice. I did not try DigitalOcean beacuse they asked me for my credit card/PayPal details. 

