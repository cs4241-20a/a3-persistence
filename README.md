TODO: VALIDATE HTML PAGES AND DESCRIBE ACHIEVEMENTS AND MIDDLEWARE

FPS Stat Calculator (A3) - Joe Swetz
===

This project continued with the application I created for A2: it is a stat calculator 
for First Person Shooer (FPS) games. The user enters the kills, assists and deaths for
game they place, and the application enters them into a running table, along with the 
calculated kill/death ratio and assist/death ratio. The running totals and averages for
kills, assists and deaths are continuously updated. The user can then download a 
CSV file with their stats, so they can make charts and graphs of their performance.

One of the biggest challenges I faced for this assignment were dealing with the 
asynchronous queries to the MongoDB database. I would often try to retrieve values from
the database to calculate the latest total and average, right after I added an element
into the table. I would oftentimes try to retrieve data from the database before the 
item to add finished inserting, leading to incorrect totals and averages. The other 
big challenge I had was implemented the mass modify and delete functionalities. I 
couldn't use updateMany since each modified row had to have their respective derived 
fields updated, and I have trouble with delete because it took some time for me to 
understand how to query for multiple ObjectIds.

TODO: I chose to authenticate with Github since everyone in the course has a Github
account, meaning I didn't have to worry about a user now having an account. For the
CSS framework, I chose Bulma because I looked the initial look of the official website,
there seemed to be a good amount of documentation, and the process of adding class 
modifies in the HTML in order to manipulate a tag's CSS properties made it pretty
straightforward to use.

The five Express middleware packages I used were described below in the list of 
implemented functionality.

Baseline Requirements
---

I satisfied the requirements for this assignment in the following ways:
- **Functionality**
    - A server using Express in server.js which implements the same FPS Stat
    Calculator applicatio from A2.
    - todo: show only data for user
    - Form/Entry Functionality is implemented as a from for adding an new element,
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
    - HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two simple pages for this assignment, one that handles login / authentication, and one that contains the rest of your application. For this assignment, it is acceptable to simply create new user accounts upon login if none exist, however, you must alert your users to this fact.

 - **CSS**:
    - CSS styling was provided by the [Bulma](https://bulma.io/) CSS framework.
 - **JavaScript**:
    - Front-end Javascript for making HTTP requests, interpretting HTTP reponses, and 
    managing the tables can be foudnd in "./public/js/scripts.js". The server-side 
    Javascript that handles incoming HTTP requests, makes MongoDB database queries,
    and sends HTTP responses can be be found in "server.js".
 - **Node.js**:
    - The server in server.js was created using Express. Five pieces of Express 
    middleware were used, and a persistent database from MonngoDB was used (see 
    points above for more detail on there)

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authenticaion or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total).