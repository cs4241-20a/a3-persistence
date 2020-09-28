Assignment 3 - A To-Do List Application

Name: Nicole Jutras
Link:http://a3-nicole-jutras.glitch.me

Project Summary:
The goal of the application is to have a user login with a password,
the have access to a to-do list of their making. The user can add, delete,
and modify these tasks, and the results will change in the database
based on what is done. I chose Wing as a CSS framework because it seemed
easy to use and sleek in its minimalist design. I did modify
the margin of each list item because they were lining up with the delete
and modify buttons incorrectly. The five middleware packages I used are
body parser, cookie parser, error handler, response time, and connect
image optimus. Body parser allowed me to parse the HTTP request body.
Cookie parser helped parse the cookie header. Error handler allowed me to
debug in an easier way. Response time recorded the HTTP response time.
Connect image optimus is meant to optimize image serving. I also
installed passport, but I was unable to correctly implement this in my
login screen. I have commented code snippets of what I attempted, 
but I could not get it working properly. As a result, my Results function 
works incorrectly. This login was the most difficult part
of the assignment.

Technical Achievements
Tech Achievement 1: 
N/A

Design/Evaluation Achievements
Design Achievement 1:
I followed the following tips from the W3C Web Accessibility Initiative:

1.Provide informative, unique page titles. I did this by ensuring I had
two titles that were easy to understand. The two titles were "Assignment 3-
Login Page" and "Assignment 3 - To-Do List". These two titles are
unique, yet both reference aspects of assignment 3.

2.Use headings to convey meaning and structure. I did this on the login
page by titling the username and password inputs above their text
boxes. On the to-do list page, I have a main title saying
"What needs to get done today?" Then I label the to-do list itself and
have a title for Tasks that can be inputted to the list.

3.Provide clear instructions. I do this on the login page by stating that
a user must enter a username and password in order to login. An alert
tells the user this in a pop up message if they do not put text in either
box. Additionally, on the to-do list page, if a task is edited, the
user is clearly asked what they would like to change the task to.

4.Keep content clear and concise. Similar to number 3, I use clear language
in all of my text on the page. There is not much text to begin with, as I
was careful to minimize unnecessary text. The only text on the page is
absolutely essential to the user's understanding and usage of the application.

5.Provide sufficient contrast between foreground and background. I do this
on the login page by having a gray box around the items on the page. All
text stands out against the color in the background so that the user can
quickly look at the page and understand what is going on. Again, there
is a gray box around the "adding a task" section of the to-do list page.
This contrasts with the white background overall in order to draw the
user's attention.

6.Don't use color alone to convey information. On the login page, if
a user does not input something in the username or password text boxes,
the border of the box changes color to blue to highlight this. However,
that is not the only thing that happens in this instance. An alert
pops up on the screen right next to the text box saying that this
field must be filled out.

7.Ensure that interactive elements are easy to identify. I did this
on the login page by making sure that when input text boxes are hovered
over, the color of the border changes from gray to black. In this way,
the user knows this is something they can interact with by clicking on it.

8.Ensure that form elements include clearly associated labels. I did this
by making sure that above and to the left of every text input box, there
was a clear label. I do this with Username, Password, and Tasks. It is
unmistakable what each box is meant to input.

9.Provide easily identifiable feedback. I do this on the login page when
nothing is input for the username or password. An alert pop up comes up
to the screen and tells the user "Please fill out this field". This pop up
is pointing to which field needs to be filled out.

10.Use markup to convey meaning and structure. I do this by adding
meaningful ids and classes to every applicable item on the page. In this way,
anyone reading the code can infer what I am referencing.

11.Help users avoid and correct mistakes. I do this as I have stated
before by having pop up alerts on the screen that point to where mistakes
have been made in the system.

12. Ensure that all interactive elements are keyboard accessible. I
    do this by allowing a user to hit the "Enter" or "Return" keys on their
    keyboards to submit their info to the login screen and to add a new task
    to the to-do list.

I followed CRAP design principles:

I utilized contrast in my design in order to guide the user’s attention
to certain aspects of my application. Primarily, I used gray backgrounds
to surround places where users would input information into text boxes. 
This highlighted the white text box against the gray background, instead 
of having it blend more into a white background. I also had textbox borders 
on the username and password fields turn blue if there was no given input.
This contrast also draws the attention of the user, so that they know they 
need to add something to this area. The color of all the text I have on 
each page does vary, but mainly they were chosen to contrast with their 
background in a meaningful way. For example, the text in all of my buttons 
are white because the buttons themselves are black.

Repetition was more intuitive for me. I practiced repetition in my design 
by being consistent with the font style I used and where I displayed each 
color text. All of the text in buttons was white. My headings are typically
black, except for the to-do list page where I used a bright blue for better
contrast. The text in each of the text boxes was light gray, indicating 
that it is a placeholder. Buttons are placed in intuitive locations for 
the login page and the tasks page. I also have a background box of gray 
around locations where a user has to input a field. This repetition 
causes the user to expect they will need to input something into a text 
box when they see it.

I found it difficult to add alignment elements to my application, but it 
was easier to do once I looked at my application in a full screen. In 
general, the alignment of text entry boxes is to the left side of the 
page. This is a very intuitive and readable way to place these elements, 
as English readers typically read from left to right. Based on advice from
class, I chose not to center any of my headings, as this is more 
restrictive to a user. The user should be able to cleanly see where each 
element is and how it relates to the elements around it. I also placed 
titles to text entry boxes to the upper left of the box itself. This is 
to provide an intuitive way to navigate and understand the site.

Creating proximity in my application involved more CSS styling. One 
important part of this was to make sure there was enough space between 
elements. In particular, my edit and delete buttons were too close to each
other originally, so I had to make sure to separate the two. However, I 
couldn’t separate them too much or they seemed unrelated and awkwardly 
placed. This took some tweaking. I also had to ensure that the space 
horizontally between list items was enough. Before I added space here, 
the list looked very cluttered and crammed together. After I made 
modifications though, it was much easier to see which edit and delete 
buttons went with each item in the list. I also made sure to leave enough
space between headings, as well as enough space between text entry boxes 
and their titles.
