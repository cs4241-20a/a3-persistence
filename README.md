# Tagteam Marathon (v2.0)
CS 4241 Webware A3-Persistence - Matthew St Louis

Submission: [a3-matthew-stlouis.herokuapp.com](https://a3-matthew-stlouis.herokuapp.com)

1. [Tagteam Marathon (v2.0)](#tagteam-marathon-v20)
   1. [Core Assignment](#core-assignment)
      1. [Goal](#goal)
      2. [Required Components Checklist](#required-components-checklist)
      3. [Authentication](#authentication)
      4. [CSS Framework](#css-framework)
      5. [Express Middleware](#express-middleware)
      6. [Challenges](#challenges)
         1. [Passport.js](#passportjs)
         2. [Middleware](#middleware)
         3. [Huroku](#huroku)
   2. [Template](#template)
   3. [Achievements](#achievements)
      1. [Technical Achievements](#technical-achievements)
      2. [Design/Evaluation Achievements](#designevaluation-achievements)
2. [Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template](#assignment-3---persistence-two-tier-web-application-with-database-express-server-and-css-template)
   1. [Acheivements](#acheivements)

## Core Assignment
### Goal
This project is a new version of my project for the last assignment - [Tagteam Marathon](https://github.com/mastlouis/a2-shortstack), but most of the code has been changed.

Tagteam Marathon is an app to help teams of runners share their runs with each other and track their collective progress. The intended use of this is for runners who want to have a social aspect to their runs without physically meeting up during the time of social distancing. Users can log in with GitHub to add, modify, and delete runs.

Currently, runs are tied to specific accounts, and there is no way to share runs across accounts, so the app is only suited for runners tracking their runs as an individual. However, the app provides all functionality necessary to meet this goal.

### Required Components Checklist
- [x] A `Server`, created using Express
- [x] A `Results` functionality which shows the entire dataset residing in the server's memory
  - The professor specified in the Microsoft Teams chat that it would be sufficient to display all data relevant to the user who is currently logged in. This data all displays in the __Completed Runs__ table.
- [x] A `Form/Entry` functionality which allows users to add, modify, and delete data items associated with their user name / account.
  - The user may enter a new run through the __New Run__ form to add data. The user may delete a run using the __Delete Run__ button on the Actions menu corresponding to the target run. The user may edit a run using the __Edit Run__ button on the Actions menu corresponding to the target run.
- [x] Use of at least five Express middleware packages
  - Middleware
    - express-lowercase-paths
    - serve-favicon
    - helmet
    - connect-rid
    - connect-timeout
  - Use of middleware is detailed further [here](#express-middleware).
- [x] Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- [x] Use of a CSS framework or template.
  - I used Bootstrap for almost all of the styling.
- [x] HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
  - A _text-flavored input_ was used for collecting the name and location on a new run.
  - A _number-flavored input_ was used for collecting the distance and time on a new run.
  - A _textarea_ was used for collecting notes on a new run.
- [x] HTML that can display all data *for a particular authenticated user*. 
  - The __Runs Table__ Displays all of a user's runs and can be used to access all data for each run.
- [x] Create new user accounts upon login if none exist, however, you must alert your users to this fact.
  - __When a new user creates an account, they will get a single `alert()` notification to tell them that they a new account has been created for them. This will only appear once.__
- [x] A small amount of front-end JavaScript to get / fetch data from the server.
  - This is contained in the [script.js](./public/script.js) file.

### Authentication
I chose to go with the GitHub authentication strategy with Passport.js for the design achievement and because I wanted practice with external SSO, and GitHub seems like a practical choice for potential future projects. I feel like I could use this to secure a small webapp in the future. This is discussed further in my [technical achievements section](#technical-achievements).

### CSS Framework
I chose Bootstrap as my CSS framework because it has the largest userbase of any major CSS framework. I personally think Bootstrap looks tired and ugly, but I figure that it is a skill I should have in case I encounter a project that uses bootstrap in the future.

The only real modifications I made to the CSS was to hide the login view and display the page content if a user is authenticated.

### Express Middleware
Here are the five pieces of middleware I implemented in my server and what they help with:
- __express-lowercase-paths__
  - Converts all request paths (e.g. GET, POST) to lowercase. This makes the requests slightly more resilient
- __serve-favicon__
  - Used to serve the running shoe favicon for the app
- __helmet__
  - Attaches a set of responses to all outgoing responses and refuses certain insecure requests. This increases security.
- __connect-rid__
  - Issues an ID to requests to keep better track of them.
- __connect-timeout__
  - Times out requests after a specified interval (I set mine to be five seconds)

I also used some middleware to implement the OAuth, but my understanding is that it would not double-count toward the five required pieces of middleware. They are as follow:
- __passport__
- __passport-github__
- __connect-ensure-login__
- __morgan__
- __cookie-parer__
- __express-session__

I forgot until writing this that I am also using __body-parser__.

### Challenges
The most significant challenges I ran into for this project were working with Passport.js, implementing 5 pieces of middleware, and uploading to Huroku.

#### Passport.js
Passport.js was by far the greatest time sink in this project for me. I tried following a few different tutorials, but I kept running into small issues with exactly how it's supposed to work. Most of the tutorials I found used a login page, which I do not, and I did not understand why Passport.js should work differently in terms of authentication whether or not the application has a login page to redirect to.

Here is a sample of some of the problems I ran into:
- Finding the correct parameters for `passport.authenticate()`
- Including port number when registering with GitHub
- Figuring out the right series of redirects for incoming and outgoing authentication requests
- Registering for an ID and Secret with GitHub
- Wading through EJS in the examples for Passport.js
- Determining which Middleware from the examples was and was not important to authenticating the user
- Storing URLs in the `.env` file to change them out when deployed without changing them locally.
- Removing the port number from authentication and callback URL's when deploying to Heroku.

Setting up Passport.js consumed roughly a day of work for me.

#### Middleware
The second challenge I ran into was finding five pieces of middleware to incorporate [listed above](#express-middleware). My app didn't really need middleware aside from those used for other requirements, so I felt like I was reaching to find it.

Hemlet.js alone cost me about an hour. I installed it without issue, but it prevented me from accessing Bootstrap through a CDN. I tried downloading a local copy of Bootstrap, but this was likewise thwarted. I spent a while looking for other workarounds before going through the Helmet.js documentation to loosen the security constraints and to allow external requests.

#### Huroku
Uploading to Huroku was not too challenging, but I think it was significant enough to mention. 

I fumbled with Digital Ocean for about an hour before giving up on it. I downloaded an authenticator app and went through account setup before realizing that there was no free tier. I tired to host it there anyway, but I could not get my code onto the server. I tried VS Code's SSH, but it wasn't working, and I tried their web terminal, which was unresponsive.

When I switched to Heroku, I spent a good hour just trying to get the GitHub Authentication to work again. The URL's are very finnicky. I got to the point where I tried reformatting the strings for the callback URL a few times, and one of them worked. I don't know what I did differently the time it worked, but it must have been something.

## Template
Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does

## Achievements
### Technical Achievements
- **Tech Achievement 1**: 
- I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...

# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template


Do the following to complete this assignment:

1. Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

## Acheivements


Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authenticaion or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 
