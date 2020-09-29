FPS Stat Calculator (A3) - Joe Swetz
===

Project site: https://a3-joe-swetz.herokuapp.com/

This project continued with the application I created for A2: it is a stat calculator 
for First Person Shooter (FPS) games. The user enters the kills, assists and deaths for
game they play, and the application enters them into a running table, along with the 
calculated kill/death ratio and assist/death ratio. The running totals and averages for
kills, assists and deaths are continuously updated. The user can then download a 
CSV file with their stats, so they can make charts and graphs of their performance.

One of the biggest challenges I faced for this assignment was dealing with the 
asynchronous queries to the MongoDB database. I would often try to retrieve values from
the database to calculate the latest total and average, right after I added an element
into the table, leading to incorrect totals and averages. The other big challenge I had 
was implementing the mass modify and delete functionalities. I couldn't use updateMany 
since each modified row had to have their respective derived fields updated, and I had 
trouble with delete because it took some time for me to understand how to query for 
multiple ObjectIds. Finally, the last challenge was getting Github Authentication to work,
which after hours of debugging turn out to be a misunderstanding of what the callbackURL
in Github was supposed to be (I originally put a file path to the HTML page that I wanted 
to be redirected to, not the route on the server to handle the GET request).

I chose to authenticate with Github since everyone in the course has a Github account, 
meaning I didn't have to worry about a user now having an account. For the CSS framework, 
I chose Bulma because I looked the initial look of the official website, there seemed to 
be a good amount of documentation, and the process of adding class modifies in the HTML 
in order to manipulate a tag's CSS properties made it pretty straightforward to use.

The five Express middleware packages I used were described below in the list of 
implemented functionality.

Baseline Requirements
---
I satisfied the requirements for this assignment in the following ways:
- **Functionality**
    - A server using Express in server.js which implements the same FPS Stat
    Calculator application from A2.
    - The Results functionality was implemented using Github authentication and 
    username/password login. The table now only show the data in the database for
    the currently logged-in user. (The assignment says to return all data on the
    server, but Professor Roberts confirmed in Teams that we are only supposed to
    retutn data for the currently logged-in user);
    - Form/Entry Functionality is implemented as a form for adding a new element,
    a form for modifying all the rows in the table that are checked off in their 
    respective checkboxes, and a Delete button that deletes all items in the table
    that are checked off in their respective checkboxes.
    - The following 5 Express middleware packages were used:
        - **express.static**: Used to send the static CSS, JS, and HTML files in the
        "./public" directory.
        - **morgan**: Used to log HTTP requests made to the server to view network 
        activity.
        - **passport**: Used for Github authentication so users can sign in and see 
        their specific stats.
        - **convertDataToNum**: This is a custom middleware function in server.js 
        that takes all the values in the incoming request body to Numbers instead of
        strings, so the mathematical operations needed for calculated the derived 
        fields, totals and averages can take place immediately once the request 
        reaches its designated route.
        - **checkForAccount**: This is a custom middleware function in server.js
        that will check if there is a user currently signed in. If a user is not
        signed in, this function will return the response with an error and tell
        the user that they must be signed-in to use the application. This prevents
        users from going straight to /app.html and manipulating the database.
    - Persistent data storage in between server sessions is implemented using a 
    MongoDB database. See server.js for the initialization of the database connection
    and the various queries that are used.
    - The CSS framework [Bulma](https://bulma.io/) was used to style the front-end UI.
- **HTML**:
    - The following HTML input and form tags were used:
        - **checkbox**: Used to select multiple rows of data for mass modification and
        delete.
        - **text**: Used to input stats for a new item to add, or for fields to be 
        modified on the selected items.
        - **button**: Used to trigger actions for adding, modifying and deleting rows
        of stats.
    - The HTML tables results_list and totals_avgs_list are updated in script.js to display
    all the data returned from the HTTP requests. The server only returns data for the 
    current logged-in user, so the HTML tables will always only display the data for the
    current authenticated user. If no user is signed in, all HTTP requests to get or set
    data will return and error (see the checkForAccount middleware described above).
 - **CSS**:
    - CSS styling was provided by the [Bulma](https://bulma.io/) CSS framework.
 - **JavaScript**:
    - Front-end Javascript for making HTTP requests, interpreting HTTP responses, and 
    managing the tables can be found in "./public/js/scripts.js". The server-side 
    Javascript that handles incoming HTTP requests, makes MongoDB database queries,
    and sends HTTP responses can be found in "server.js".
 - **Node.js**:
    - The server in server.js was created using Express. Five pieces of Express 
    middleware were used, and a persistent database from MongoDB was used (see 
    points above for more detail on there)

Achievements
---
        
*Technical*
- I implemented OAuth authentication with Github via passport.js. On the home page, there is
 an option to login with Github, or do non-Github username/password. If you log in with a non-Github,
 username and password, and the account does not exist, it will be created and user will be notified.
- Instead of Glitch, I hosted my site on Heroku at https://a3-joe-swetz.herokuapp.com/. The majority
 of the process went smooth until I tried to open the app for the first time and it crashed. The web GUI
 only shows you a few of the most recent log messages, so to see the full log I had to download the CLI
 and display the logs in the terminal, only to find that some of the dependencies were under "devDependencies"
 in package.json. I was able to easily fix this, but Glitch didn't seem to care, so I found using Glitch
 to be a slightly easier experience.

*Design/UX*
- My site uses the CRAP principles in the following way:
    - **C**ontrast: For the login page, I used contrast in font-size in order to draw the user's eye to
    their two options: log in with Github, or username/password. This way they can get to the app as fast
    as possible. The app.html page uses color and shape to contrast the buttons, which execute the actions,
    from the tables, which show data. This way the user can easily see their available actions as soon as they 
    login.
    - **R**epetition: I used the horizontal lines to break up the three actions on the left-hand side, to show
    that they were separate actions, but proximimty shows that they all affect the same data. I also used the 
    same gray color on the column and row titles for both tables to unify them and show that they are related 
    (i.e. display stats from the same set of data).
    - **A**lignment: On the left column I left-justified all the text to create a vertical line along the left
    hand side of the column, thus unifying the three main actions of add, modify and delete. For the tables, I 
    align-centered all the text in all the table elements in order to create a vertical line down each column,
    unifying the data into groupings of different stats.
    - **P**roximity: For each of the three main actions (add, modify, delete), I placed the instruction text,
    the form, and the button close together to show their relationship (the repetition of the horizontal line
    also helped create these groupings). The three main columns (the forms, main table of stats, and smaller
    table of totals and averages) are closer together (leaving white space at the sides) to show how the three
    elements are affected by one another: adding modifying or deleting stats will alter the values in the middle
    table, and the values in the middle table will affect the values in the rightmost table.