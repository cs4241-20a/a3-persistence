README.md
===

CS 4241: Webware Assignment 3: Persistence
---

### Author: Eric Reardon

**Live App Link**: https://a3-eric-reardon.glitch.me

# Karate Dojo Roster WebApp

For assignment 3, I developed a karate dojo roster management WebApp. The purpose 
of this app is to allow different sensei's to keep track of and manage their unique
rosters (or list of students). Upon login (in which a sensei would enter their last name
and password), it will display each student in their class and each student's
unique information (name, karate belt color, age, and win ratio). From here, a
user is able to add and delete students from their class, and edit their students'
information as it changes. All of this data is shown on the front end and stored
in a mongoDB database.

For the login, a user will enter their username (last name) and password, which
will give them access to their individual roster. Currently, I have two accounts
already set up.
- Sensei Reardon
  - **username: Reardon**
  - **password: password**
- Sensei Roberts
  - **username: Roberts**
  - **password: password**
  
To create a new account, simply use the "New Account" form that is below. This will
create an account and let a user login using the "Login" form.

## Baseline Requirements

**Server**
- Successfully created using Express.

**Results**
- Results functionality which shows the entire dataset for each Sensei in a table, 
residing in the mongoDB database.

**Form/Entry**
- Login form to allow access to a particular user
- New Account form to create a new account in the database
- Roster Management form which allows users to add, modify, and delete data items
associated with their account

**Express Middleware**
- The six express middleware packages I used were:
  - serve-static: serves files statically, including html, javascript, and css files
  - body-parser: parses HTTP request body and transforms it into more managable json objects
  - passport: handles OAuth authentication for user login
  - helmet: increases security on database requests (get, post, delete), by providing default headers
  - morgan: HTTP request logger to cutomize and "combine" output
  - compression: compreses HTTP requests

**MongoDB Storage**
- Achieved persistent data storage between server sessions by using MongoDB

**CSS Framework**
- For CSS framework, I used Wing. Wing is an extremely lightweight framework which is great for an elegant
minimalist design. It made styling very easy, as all I had to do was add a `<link>` in the `<head>` to import 
Wing styling into my project. It also came with many packages/features which were very easy to learn.

**HTML**
- I use various HTML input tags (mostly `<input>`) and various other HTML elements to cleanly display all
data for a particular authenticated user.

**CSS**
- Most of my CSS styling is provided by my chosen framework, Wing. The use of Wing allowed me to
deploy a more professional looking design aesthetic without doing much graphic design myself. However,
I also handled a lot of CSS styling to make sure to satisfy CRAP principles.

**JavaScript**
- My script.js and server.js files are used to get / fetch data from the database.

**Node.js**
- I've succesfully made a server using Express, used five pieces of Express middleware, and get/store data
from a persistent database (mongodb).

## Technical Achievements

**Technical**
- (10 points) Implement OAuth authentication
  - I chose the local authentication strategy instead of GitHub, as it was much simpler. For the purpose 
of my WebApp, I'm not too concerned with the security which GitHub would've provided. Due to this, be cautious
of using an important password when testing this application, as it is just stored in plain text.
To achieve OAuth authentication, I used the passport middleware library to authorize() all requests.
  
**Design/UX**
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's 
Design Book readings
  - Contrast
    - For my colors, I used a more simple theme. By keeping a white background, I was able to make sure
    that all of my text was contrasting its background in order to stand out.
  - Repetition
    - For color theme, I used the repeated shades of purple which show up for the buttons, forms, and table coloring.
    Additionally, my text formatting is repeated thanks to Wing, and all of my buttons are formatted the same way (with
    the exception of the table buttons - edit and delete). These two are different by design to keep it simple and clean
    within the table. Customizing responsive buttons within the table might have been "too much" on the user. Lastly, I 
    have the same styling for all inputs.
  - Alignment
    - I made it a priority this project to make sure all text and elements are aligned. I used CSS styling and flex boxes
    to make sure that all my text is either aligned perfectly, or centered on the page. The use of flex boxes to display
    the enrollment form and class information made it very easy to align elements well. Additionally, the table handles
    a lot of alignment as well. The hardest part was to just make sure that they all spread the same width on the page and 
    maintained this alignment consistently.
  - Proximity
    - For proximity, I was mostly concerned with the padding around inputs. I made sure that there was consistent spacing around
    text and inputs by using `margin:`and `pattern:` CSS styling. Nothing on my WebApp overlaps, and there is sufficient spacing
    so that the items on the screen don't look too crowded.