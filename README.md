## My TodoList

Thomas Graham

https://tgrahamcodes-a3-thomas-graham3.glitch.me

https://a3-thomasgraham-tgrahamcodes.herokuapp.com/

My project is made to contain a todo list behind a login element. This will let users create their own todo list based on who is 
currently logged in. It would eventually store these logins to the database with a token and return the tasks.

One challenege I faced was first with the mongodb db connection, it took me a while to get that working in both directions.
Another challenege I faced was the passport.js login, unfortunately I wasn't able to implement this for this project because 
I kept getting different errors, so instead I went with a new user being created on login. The one I chose is password/username because
it was the easiest to implement and I couldn't get the github version working correctly.

The CSS framework I used is bootstrap because I am familiar with it from the past and figured it would be a good framework to continue with
learning more about it. The modifications I made to the CSS was mostly just adding the Google font rule and centering the todolist form, and
a little bit of text alignment. These all felt correct to me and change anything too major in the styling.

The five express middleware packages I used were bodyparser, morgan, serve-static, serve-favicon, and compression. BodyParser allows easier
parsing of the HTTP request body using req.body. Morgan allows all HTTP requests to be logged, and in my case logged to STDOUT. Serve-static allows
easier serving of static files on the web server.  Serve-favicon also does what it implys and serves a favicon. And finally compression will compress 
each HTTP response of all the requests that travel through the middleware.

## Technical Achievements
- **Tech Achievement 1**: (5 Points) I used heroku to deploy this project. It was much faster than glitch. It also offered the github connect option that 
glitch has too which made it even easier to deploy the project. The app initally was working but eventually stopped working so maybe glitch is a 
better option in the long run. The project is deployed to glitch too just in case.

### Design/Evaluation Achievements
- **Design Achievement 1**: (10 Points) Make your site accessible using the resources from WC3. 
    --Provide an informative unique page titles. My TODO List App, and My TODO List Login Page
    --Use headings to convey meaning and structure. Used h1,h2,h3s throughout to convey meaning.
    --Make link text meaningful, Submit is properly labeled add task as that is what it does.
    --Write meaningful text alts for images, properly labeled the image on the front page as what it is
    --Provide clear instructions, this is done on the main page after login
    --Keep content clear and concise, this is followed throughout the website as its just minimal instructions
    --Provide sufficient contrast between forground and background, this is done on the main page wit the blue and orange and the white and blue 
    the white makes the text easier to read and the orange background is a complementary color of blue.
    --Don't use color alone to convey information, this is not done as the colored parts are also larger and a google font
    --Ensure that interative elements are easy to identify, this is done with the button on the bottom clearly sticking out and it has instructions
    --Ensure that form elements contain clearly associated lablels, this is done with the form on the main page using labels for password and username fields
    --Create designs for different viewport sizes, this is done because I'm using bootstrap and it resizes for mobile devices.
    --Identify page langague and language changes, this is done in the head using the meta tag to state it is in english.