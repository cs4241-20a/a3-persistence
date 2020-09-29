## Yongcheng Liu 's Assignment 3 Submission

[Heroku Link](https://a3-yongcheng-liu.herokuapp.com/)

In this assignment, I have managed to do the following:
    1. Server: The server is completely written off express, which can be checked in server.js
        - Five Middleware Packages: 1. body parser. 2. error handler. 3. dotenv (for .env file locally) 4. response time 5. connection timeout 6. node statsd
    2. Results Functionality + Form Entry + CSS(BootStrap) + HTML Input Tags: 
        - Players now can put their name and password to log in. 
            - If it is an unexisted user, a new user will be created with highscore set to -1 (will be automatically updated if new record is generated). 
            - If it is an existing user, 1) if he is admin, will guide to admin page. 2) if old player, will sync with database to retrieve highscore (also compare password, if incorrect, cannot log in)
        - BootStrap For the Log in page
        - Multiple form/input elements for log in and admin page
    3. Data Storage + Results Functionality + Form Entry:
        - Admin can log in to an very primitive admin page with **username: admin, password: 12345**
        - He can view all users there. He can also add, modify, or delete users there.
    4. MongoDB: To Store User Related Data

Also Inherited from last assignment, entered players can play a reaction game.

### Technical Achivements
1. OAuth: Admin to admin page with **username: admin, password: 12345**. Other players can only play and access their own data (and never modify, add, or delete any of the fields. All are updated automatically)

2. Tried both Heroku and Digital Ocean: Those seem to be more "mature" and close to industrial standards, but they are not that friendly to beginners. Glitch has a lot of features that helps you easily deploy a website。 But Heroku and Digital Ocean (idk tbh, cuz I need to activate that with credit card, so I gave up) provides way more complex feeatures like TravisCI, Metrics, Access Control, etc.

### Design Achivements
1. W3C: 
  - 1. Provided sufficienct contrast between forground and background (login page)
  - 2. Do not use color along to convey information - I used texts (Play! Log In!) to guide also.
  - 3. Ensure that interactive elements are easy to identify - Play! haha
  - 4. Provide Informative Unique Page Titles - Admin, Log in, Game
  - 5. Use Headings to convey meaning and structure - used in admin, log in
  - 6. Provide Easily Identifiable Feedback - Reaction Test 

  ... I cant do more. I am not doing good design XD.