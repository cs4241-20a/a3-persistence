Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

## Classic Car Wishlist - Maria Medina Martinez

https://a3-maria-medina-martinez.herokuapp.com/

Application goal: 
  - Create a wishlist to keep track of the cars a user wishes to purchase.

Challenges:
  - Understanding the relationship between middleware functions and express app calls.
  - Logging in a user and persisting their userID across the HTML pages.
  - Manipulating the MongoDB collection responses to get the data of interest.

Authentication Strategy: 
  - Basic logging in with a username and password
    - I chose this because it provides an easy way to create a new user account or log into an existing one without using another app.
  - Github OAuth
    - This provides users an easy way to log into the application.
    - The default test account you may log in with is "testuser"/"pw".

CSS framework:
  - Used the minimalist Sakura-Vader framework. I used this because it was simple to implement and did not require familiarizing myself with obscure class names that other frameworks seem to use to customize your app. This framework was simple to use and provided a clean look to my app.
  - The only modifications I made to the CSS were to the button, form input, and table hover effect.

Express middleware:
  - Passport: Used for secure authentication. Used by the Github OAuth strategy.
  - BodyParser: Parses body of post request. Used to provide simplicity to parsing json.
  - Serve Static: Used to replace express.serve. Serves public folder statically.
  - Response Time: Tracks response time for all HTTP requests. Useful during debugging for checking response time of request.
  - Morgan: Logs HTTP request to the terminal. Provides helpful deugging logs.
  

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy to provide users a secondary login option.

- **Tech Achievement 2** I decided to host my site on Heroku. Along with having a simple process to deploy apps from Github, Heroku has a much cleaner interface than Glitch. Additionally, I liked the fact that changes pushed to Github were automatically deployed to my web app. This was very usedul and proved much more efficient than Glitch's manual deployment process.
