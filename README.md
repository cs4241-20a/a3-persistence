Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template README
===

## A simple To-do List Part 2
glitch link e.g. https://glitch.com/~a3-lara-padir

This project connects my glitch application to a MongoDb database. Once a user logs in, they can add items, delete items, and modify items on their to-do list. 
I used the Git Oauth authentication for this application. I used this authentication in order to try to recieve extra points on the assignment. This is the part of the assignment
that I particularly struggled with. I first tried to have a collection of just users, so when a user makes an account their user would be added to that collection. 
Then for each item, when a user logged in their tasks would display on the page. I was unable to get this working properly. I then tried to save the username and send that to the database
with the added item (under the same collection), but I was unable to get this to work as well. I put a lot of time into this, but unfortunately was not able to get this to work.


I use the body parser, error handler, cookie-parser, passport, and cookie-session middleware packages. The body parser is responsible for parsing the incoming request
bodies in a middleware before it is handled. The error handler package is responsible for handling errors, separating them, and sending responses accordingly. 
The cookie-parser package is responsible for parsing cookies attached to the the client request object. The passport package is respobsible for authentication in node.js. Lastly, the cookie-session 
package is responsible for storing data from the client in a cookie and storing the session data on the server.

Lastly, I used milligram as my basis css framework. I changed the button styles and added color, and a hover color to the buttons.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth GitHub Authentication

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative. 
First, I provided informative heading titles. I used "Sign-In to Your ToDo List" and "ToDo List" for each page.
Second, I use headings to convey meaning nd structure. Having a sub-heading of "add an item to your todo list" separates my page and makes it clear to the user what do do on the ToDo Page.
Third, I provide clear instructions. On the login page, I say that a user must enter a username and password in order to login. If the user does not do this an alert will pop up telling the user to input in both fields.
Fourth, I keep content clear and consise. I have no filler words on the page that will distract the user from their task.
Fifth, provide sufficient contrast between foreground and background. I have a grey box to contrast the list items and the form from the rest of the page.
Sixth, I never use just color to convey information. I have color and words to convey a message. For example, the delete button is red but also says delete.
Seventh, I ensure that interactive elevements are easy to identify. For example, when you hover over a button the button will change colors, so the user knows its a button.
Eigth, I make elements associated with labels. I have the username and passord labels to identify the text fields underneath.
Ninth, I use markup to convey meaning and structure. I use id values in my html code to go with corresponding values. For example, the id for username is user.
Tenth, I have help users identify and correct mistakes. I use alert messages to tell the user if they did not fill out on of the necessary field items.
Eleventh, I make my buttons keyboard accessible. I allow the user to press enter or click any button on the site.
Lastly, I provide easily identifiable feedback to the user. For example, I alert the user if they have not filler out all of the fields to log-in to their todo list.

- **Design Achievement 2**: I followed the CRAP principles:

First, for contrast I use a grey background behind the form and list items. This draws the users attention to this part of the page, which is where I want their attention to be. 
I also provide contrast to the text and button colors on the page. I have brighter colors for the buttons so the users attention is also drawn to them. The hover button color is different, and provides different contrast
to show the user that there is an interactive functionality to them as well.

Next, for repition I use the same button classes for the whole site. I also use the same font, text boxes, header styles, and form style for the whole site.
This provides the most consistency to my design. The website is pretty plain, but the repition I use make it simple, elegant and most importantly consistant across both webpages.

Then, for alignment I use the left-align for my whole website. This is an intuitive and readable way for users to look at the site and understand what is going on. Their eyes will read left-to-right
and then top-to-bottom, which is the oder in which I want them to see my site. I did not center the title of each page, because I thought it would mess up my consistency and would not look as clean as the left-alignment.


Lastly, for proximity I group elements that are related in a single form. All of the login items are contained in one form, displaying to the user that each of these items are realted to one another.
Similarly on the todo list page, all of the list elements and atted items are in the same form. The logout button however is not in the dame form as those items because it is not related to the users todo list. 
I furthermore made sure the spacing between each element was not too wide, but also not too squished togehter. The spacing allows the user to see which title goes with which text field and allows them to group items together.
That is why the spacing is very important to each of the elements on the page.