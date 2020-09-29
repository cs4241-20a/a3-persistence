Rory Sullivan Assignment 3 - Miss Puff's Boating School Website
your glitch (or alternative server) link e.g. https://a3-rory-sullivan.glitch.me/

The goal of this application was to create a site where students can enroll in classes, drop classes, and modify their record in a 
boating class (for example, if you get in an accident, your # of accidents on your record must be updated). Additionally, professors
of the boating school should be able to login (a login account can be created by typing in login information during the first login
attempt on the server. Login information is not stored in the MongoDB server in order to make it easier for graders to create accounts)
and see the information of everyone enrolled in the school. Additionally, professors can see the grades of students in the school, which
is not visible to students. 

Challenges faced during the creation of this application were molding my assignment 2 in order match the requirements of project 3. I
decided to continue with the concept of my site from project 2, however in order to meet the project 3 requirements, I practically had to
rebuild my site from the last assignment, which created a lot of conflicts in the server.js in order to account for express. These conflicts
took some time to iron out and fix. 

The authentification strategy I used was to create a login system within my database. I chose this strategy because my initial thoughts when
reading the instructions were that I had to make it so the first login on that server becomes the created "account", and after that it checks
on login to see if the information matches the previously created account.

I used water.css on my professor's login page, and pure.css on my student page. I used water.css because it required very little effort to
make tables look good, and I used pure.css because it allowed me to easily format where certain forms and tables were layed out on the page.
It also had alot of great options to customize how my buttons looked. The only custom changes I made were purley to match the theme of my 
website. This involved changing colors, adding borders, padding, margins,etc. 

the five Express middleware packages I used are:
body-parser: Parses incoming request bodies in a middleware before your handlers
connect-timeout: Times out a request in the Express application (Set to 8s)
cookie-parser: Parse Cookie header - logs to console
cookie-session: cookie-based session middleware - logs the number of times users came to page
morgan: logs HTTP requests to console. 

Design/Evaluation Achievements
Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative...
  1. Provide informative, unique page titles
  2. Provide clear instructions (can be seen on student page)
  3. Provide sufficient contrast between foreground and background
  4. Ensure that interactive elements are easy to identify
  5. Ensure that form elements include clearly associated labels
  6. Provide easily identifiable feedback (Can be seen on the login page)
  7. Associate a label with every form control
  8. Include alternative text for images (index page)
  9. Identify page language and language changes
  10. Use mark-up to convey meaning and structure
  11. Reflect the reading order in the code order
  12. Use headings and spacing to group related content
  
 How my site uses the CRAP principles:
 1. Contrast:
   On each page, whereever any writting takes places, the text is colored the oposite shade of the background.
   Additionally, wherever text is location on a page, there is a solid light background in the area of the text. 
   This especially makes it easier to see contrast in text and the background when the page background is an image.
   A great area contrast is displayed on my page is in the tables. Each table element (row) alternates shades to 
   indicate a change in user data. 
 2. Repitition: 
   Repition is used on my page because elements of similar styles are designed in the same way. For example, all form
   elements on the students page have their own light rectangular area with a dark rounded border surrounding them. Also,
   the tables across pages (students and professors page) have the table designed in the exact same mannor. 
 3. Alignment:
    This is done on my page by having every element start in the top left cornor. All form elements on the student
    page, for example, are located in a horizontal line from eachother, which also serves to indicate they are of 
    the same element type (a form for the user to fill out). When a new row is started on the student page, a new
    page element is introduced, the table which displays the user data. 
 4. Proximity:
    Proximity is shown on the student page of my site. All the form elements are located right next to eachother at
    the top of the page, and the table area is seperated. This helps the user know where their input is needed, and
    where the user feedback is given. 
    