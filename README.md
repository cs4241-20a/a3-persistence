https://a3-alan-curiel.herokuapp.com/

# Flash card App

## App that allows user to add/modify/delete flash cards

- the goal of the application
  - The application is meant to store flash cards for a specified user.
- challenges you faced in realizing the application
  - Updating  and deleting information was hard to implement because you have to refrence things in the database
  - The login was hard for me since the code is really high level and hard to understand how it keeps track of a user
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
  - I chose github since it seemed fairly easy with alot of tutorials online and it gave me an idea on how I could use other OAuth logins
- what CSS framework you used and why
  - I chose water.css dark version since it was classless and I could focus more on javascript while still looking nice
  - I added a red class for showing the red color since it wasnt included in the css framework
- the five Express middleware packages you used and a short (one sentence) summary of what each one does
  - Cors - included for security and allowing outside website to access api
  - Passport - allows for login
  - Body-Parser - parses json in body of http request
  - compression - compresses http requessts
  - express-session - remembers user session

## Technical Achievements
- **Tech Achievement 1**: 

  - I used passport OAuth authentication via the GitHub strategy
  - I used heroku it was a little harder to set up than glitch. But it allows for more than node.js and seems like a better platform if I need to scale up bit keep it relatively simple. It was nice to use with github since it deployed everytime there was a push to master.


