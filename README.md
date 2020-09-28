# Gabe's Persistent Coursework TODO List
- https://a3-gabriel-aponte.herokuapp.com/
- This website is a nice and simple way for us to keep track of class assignments and project deadlines!
- The goal of this version of the website was to allow users to login to their own account and access their own personal TODO lists. Another goal that has been met is to make the data persistent, which it now does via MongoDB.
- The users can login with their own creative user name and password or via GitHub with OAuth. I choose to use passports GitHub strategy as it was recommended by the assignment and very easy to implement based off the documentation.
- To Use this app: first login. Logging in for the first time creates a new account, then you will need the same password to login to that username again.  
- To Add tasks: Simply input the Course Name, the Assignment/Task, its Due Date, and the Effort to complete it (1=least - 5=most).
- To Update or Delete tasks: use the correlating buttons in each row of the tasks table.
- The priority field will be automatically assigned based on the Due Date and the Effort of the assignment.

## Baseline Requirements
**Node.js Server**:
- Converted the server.js file to use Express only to send and receive files / data as needed.
- This server connects to MongoDB to read and write TODO list data and User data.  

**Results**:
- All of the data stored in MongoDB is accessed by the server and displayed based on which user is logged in.

**Form/Entry**:
- The UI utilizes a form that allows users to add, update and delete TODO items.

**Middleware Packages**:
- BodyParser: I use body parser to parse all the bodies in my post request. This helps reduce lines of code and create less clutter by removing the need for json parsing and string-a-fying  
- Morgan: Logs HTTP request to the terminal to help debug and see where requests are failing and succeeding
- Serve Static: Used to replace connect.serve. Serve static allows me to make the public folder and its html contents be static.
- Response Time: Used to track the response time for every http request. This was helpful when debugging!
- Helmet: Adds HTTP headers to improve security. The only modification I did was turning off contentSecurityPolicy as it was causing issues with google fonts and CSS frameworks
- Passport: Used for secure authentication. I used it for adding the GitHub OAuth Strategy

**Persistent Data Storage**:
- Utilized MongoDB to store all TODO list data and user data in the cloud so that all data is persistent, even when the server is reset.
- Created three collections in MongoDB to store task data, user data and GitHub user data

**Use of a CSS Framework**:
- Took inspiration from Minimalist and Material design framework to create the CSS of my website
  - [Sakura](https://oxal.org/projects/sakura/) and [Materialize](https://materializecss.com/)
  - I used these CSS frameworks to modify my CSS as I like the color palettes for Material Design and the simple and sleek look of minimalist designs

**HTML**:
- Utilized various input tags and form fields for data input
  - textarea: for Course Name and Task inside each row of the table
  - select: to choose the effort from 1-5
  - input type text: for Course Name, Task and Username
  - input type password: for Password
  - input type date: for Due Date
- HTML table only displays data for the User that is logged in rather than everything stored in the database
- Two html pages: One for login and one for the TODO list

**JavaScript**:
- JS code separated from the html files and  stored in the scripts.js and loginscripts.js files.
- JS used to control sending and receiving data to and from the server. Also used to populate the TODO list table with new data added by a specific user.

## Technical Achievements
**GitHub OAuth**: I used the GitHub strategy from the passport middleware to add GitHub authentication as a secondary login option.

**Heroku Hosting**: Instead of Glitch, I am hosting my site on Heroku.
- I did not find anything worse on Heroku compared to Glitch. On the other hand, I found Heroku much easier to use especially on initial creation of the project. Their UI is very simple and quick and easy to setup a new app. Also, they allow automatic builds based off new pushes to the connected GitHub branch which meant that I didn't need to manually reimport every time I made a change like I did on Glitch.  

**Ensure Users Cannot Bypass Login**: I utilized HTTP status codes to control access to the TODO List page as it needs a user to be signed in in order to access it.
- If a user attempts to navigate to index.html without logging in, the server sends a 403 code and forbids them from entering the page.
- I also ensured that Users cannot sign into multiple accounts at once by always sending a user to the current logged in account's TODO list.
- I also added in a listener that refers a page when accessed by the browser back button so that the both pages always reload and check if the user is actually logged in.
- I separated the login scripts and html from the rest of the website as well and handled page accessibility in the server.

## Design/Evaluation Achievements
**WC3 Accessibility**: I followed these 12 tips from the W3C Web Accessibility Initiative
- Writing Tips
  - 1. Provide informative, unique page titles: I followed the tips and added a unique title followed by an overarching title to each of my pages. (Ex. Login • Coursework TODO List)
  - 2. Use headings to convey meaning and structure: I use Headers to specify the page title such as Login and Coursework TODO List. I also use headers in my table to clearly show what information is in each column
  - 3. Make link text meaningful: My link tag for GitHub clearly and concisely shows the use it will Log them into GitHub. I also styled the link like a button so that they know to click it.
  - 4. Provide clear instructions: On the Coursework TODO List page, I have a short description on how to input data into the list of tasks.
  - 5. Keep content clear and concise: My descriptions about what the site is and the instructions for logging in and using the TODO list are short and simple.
- Designing Tips
  - 6. Provide sufficient contrast between foreground and background: The contrast ratio between the text colors and element colors are easily readable on the background color I chose
  - 7. Ensure that interactive elements are easy to identify: All of my interactable elements have either hover affects or mouse curser changes to show they are clickable or editable.
  - 8. Provide clear and consistent navigation options: Users can use the login and logout buttons to navigate between the two pages. Also, the back button will work as long as the User is still logged in.
  - 9. Ensure that form elements include clearly associated labels: My input fields for Course Name, Task, Due Date and Effort have text below them to indicate what the input field is for.
  - 10. Provide easily identifiable feedback: Users are alerted when their password is incorrect and if they are missing any entries in the input fields
- Developing Tips
  - 11. Associate a label with every form control: I changed by text indicators under the form inputs to use the <label> tag rather than <textarea>. Labels are better as you can link them to their input field so that clicking the label triggers an interaction with the input form field.
  - 12. Ensure that all interactive elements are keyboard accessible: All input elements are accessible via the tab button and enter buttons
