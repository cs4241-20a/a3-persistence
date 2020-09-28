## Rapper Name Generator

https://a3-jenna-galli.glitch.me/

## IMPORTANT

Anyone who uses this application needs to be logged in through github. 
If the user refreshes the page, they will be required to reloggin before modying the database


When the user inputs their first name and favorite color into the form,
the application will generate their rapper name.

- This application can add, modify, and delete data from a MongoDB collection. There is persisent storage associated with each user.

- Oauth Authentification posed a lot of issues throughout the devlepment process. 

- I chose Oauth Authentification through github because the process interested me and I wanted to challenge myself and learn this new skill.

- I used bootstrap because I've never used CSS frameworks before and I thought this one was the most relevant.  
  - In my custom style.css I changed the positioning of my elements as well as some colors to add contrast. 

- 5 Express Middlewares
  - BodyParser was used in all my data requests. It is used to parse the body of requests which have payloads attached to them.
  
  - Passport.authenticate was used in my Oauth Authorization. It is used to authenticate the user through a certain website. 
  
  - Next was used in some of my functions because it helps with the ordering of the execution of code.
  
  - Err was used for if a user fails to login through github. Err can be used to display the error that occured.
  
  - Cookie-Parser was used because it parses cookie headers and populates req.cookies with an object keyed by cookie names.

## Technical Achievements
- **Oauth Authorization**: I used OAuth authentication via the GitHub strategy.

### Design/Evaluation Achievements
- **None**: I did not attempt these achievements. 
