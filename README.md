Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

DONE - a `Server`, created using Express (no alternatives will be accepted for this assignment)    
DONE - a `Results` functionality which shows the entire dataset residing in the server's memory
DONE - a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Use of at least five [Express middleware packages](https://expressjs.com/en/resources/middleware.html). Explore! 
  JSON Parser
  Timeout
  public static
  server connection check

DONE - Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:

HTML:
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
DONE - HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two simple pages for this assignment, one that handles login / authentication, and one that contains the rest of your application. For this assignment, it is acceptable to simply create new user accounts upon login if none exist, however, you must alert your users to this fact.

CSS:
- CSS styling should primarily be provided by your chosen template/framework. Oftentimes a great deal of care has been put into designing CSS templates; don't override their stylesheets unless you are extremely confident in your graphic design capabilities. The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:
DONE - At minimum, a small amount of front-end JavaScript to get / fetch data from the server. See the [previous assignment](https://github.com/cs4241-19a/a2-shortstack) for reference.

Node.js:
DONE - A server using Express, at least five pieces of Express middleware, and a persistent database (mongodb).

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authenticaion or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

Clay Oshiro-Leavitt
CS4241
your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

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
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I opted to host my website on Heroku.

### Design/Evaluation Achievements
I did not pursue any Design Achievements for this project.
