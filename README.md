Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Camera Listing Boi Reloaded

Clay Oshiro-Leavitt
CS4241
Heroku Link: https://cs4518-assignment3.herokuapp.com

Default Login:
Username: Username
Password: Password


This webpage is a continuation of the previous webpage I made where individuals can post listings of cameras to a website - this time using their own accounts. On arrival to the website, the user is presented with a login screen - here they can either enter their existing credentials or create a new account. Once past the login, the user can either list, update, or delete an existing listing as well as view the listings they currently have posted. 

This assignment had numerous challenges. One major challenge was debugging issues due mistakes in control flow. I had a particularly frustrating bug that would present itself as a Mongodb error with the message that there was no Primary server available. However, this was not the case. The actual issue was that there was a certain branch of my login logic that would not send a message back to the client. This led to a timeout, which somehow resulted in that error message. After struggling for hours with that error, I was finally able to track it down and resolve it after noticing that new logins were being logged in my remote database.

The authentication is incredibly simple. For a given username, the remote database is queried to see if an account with that username exists. If so, the password is checked to see if it matches. If not, the user receives a popup message indicating that their login credentials are wrong. If the user does not currently have an account, the account information is stored in the database and the user is automatically logged in with said credentials.

I decided to try Bootstrap as it is a well known, popular standard and I wanted to gain experience with it. My website is still basic visually, but makes use of Bootstrap's features. The only modification I made to the styling was changing how lists are presented. I removed the bullet points and added in some padding to separate the fields. I also added borders to text inputs to give a stronger visual presence.

For middleware, I used the following: 

Body-Parser: This parses the body of requests as JSONs. As most of my data is passed between the client and server as a JSON, this is a great addition to the server that greatly simplifies the server code.

Server Connection: This is a simple function that checks whether or not the connection to the server was successful. It checks if the collection value is valid - if so, the code continues. Otherwise, it sends a 503 error.

Static: This is used to serve static files for the website.

Timeout: This is used to set a request timeout for the website. This was rather useful for debugging the database error I was having (as described earlier) as I could see that events were timing out rather than having actual database errors.

## Technical Achievements

- **Tech Achievement 1**: I opted to host my website on Heroku. Setting the project up on Heroku was rather straight forward - similar to Glitch, I was able to link a Github repository. However, the connection with the repository is live. This feature is greatly appreciated over Glitch's setup, as I can continually update my code locally, push to my repository, and then redeploy my website (or use Heroku's auto deploy.) Logging and debugging was not as good as Glitch, as I had to connect to a console to view logs rather than being able to view a console concurrently with my deployment. This may not be the case, but I could not find a simpler logging solution than that.


I attempted to implement Oauth via Github, but after running into continual issues and needing to work on other course material, I did not finish the implementation. I left code I wrote in my server (removed the link on the login page), and would appreciate any feedback on the components I had implemented as I would like to use this in the future. 


### Design/Evaluation Achievements
I did not pursue any Design Achievements for this project.
