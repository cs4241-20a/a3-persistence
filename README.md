Assignment 3 By Matthew Kaminski

## The forum

glitch link [http://a3-matthew-kaminski.glitch.me](http://a3-matthew-kaminski.glitch.me)

Sample login credentials: username: username, password: password (Or just register a new account)

- the goal of the application
  - This application is a minimalist internet forum intended for developers and end users to discuss a product.
- challenges you faced in realizing the application
  - It was difficult to implement the entire user interface while keeping every aspect of it dynamic/responsive in real-time. Also, the server at some point was long and unmanageable. This problem was solved by splitting the project into multiple modules and importing the functions and variables in the server.
- what authentication strategy you chose to use and why
  - _passport.js_ was used because it was one of the most popular solutions and therefore had a great number of resources and tutorials for implementing / debugging it.
- what CSS framework you used and why
  - For the css framework, wingcss was used. wing is a css framework designed for minimalists, which was a great fit for the forum which is meant to be simple and clean. There are only a few classes and the forum and button elements looked great. Some very minor modifications of the css colors and properties were made in the _sass_ folder in this directory in order to make it better suit the site aesthetics/color scheme.
- the five Express middleware packages you used and a short (one sentence) summary of what each one does
  - morgan - Morgan was used to help with debugging and logging requests on the server.
  - compression - Compression is an easy middleware that compresses files before sending it to the user when possible.
  - body-parser - Used to automatically parse JSON post requests into a javascript object.
  - helmet - A middleware to better protect the server from malicious end users.
  - express-yup-middleware - A middleware that easily allows input verification for user forms.
  - cookieParser, session, passport - Middleware that allow easy user login management.
  - express-handlebars - A template middleware that allows easy string replacements when generating a html file for the user. This allows different website generation for logging in / different users that are logged in.

## Technical Achievements

- **Tech Achievement 1**(5 points?): Implement templated website for each user using Handlebars.

  - Using handlebars, a new website is generated for each user. When the user is not logged in, the website that is generated is the login/sign up page. However, if the user is logged in, it generates a unique website for that user. An example if this is the "username" form for adding a comment is prepopulated with the username using the handlebars template system, and that generated page is then rendered and sent only to that user. Some other differences can also be in the set of scripts that are sent to the user. To implement this, the _handlebars middleware_ was used to render the website with access to the user information generated using _passport.js_.

- **Tech Achievement 2**(5 points?): Implement input sanitization and validation for all POST requests
  - Input sanitization was implemented using the yup library, and integrated into each post request separately using middleware. Each schema is found in a new module/file _schemas.js_, which includes what each post request body is expecting and the requirements for each field. This schema is injected into each post request handler in _server.js_, and if the POST fails, it responds with a error code. In addition, each post request json element is sanitized using the _sanitizer_ library.

### Design/Evaluation Achievements

- **Design Achievement 1** (5-10 points?): The server uses sass files (sass/.scss) in order to stylize the website. Sass is like regular css but allows making variables and calling various functions, which is useful for things such as color manipulation and calculated values. In addition to learning and using Sass, the server watches the /sass directory using a folder watcher and whenever there is a change, it hashes the entire directory. If the hash does not match the previous hash (which is stored in persistent storage), it deletes the /public/css folder, and regenerates the css files (using node-sass). This allows modifying the sass in real time and seeing the changed in the website automatically. This took a long time to make, and all of the code is found in the _compileSass.js_ file. Using this, the website variables are easily changed (e.g. colors) simply by just modifying variables in the variables.scss file.

- **Design Achievement 2** (5 points): The CRAP principles were deeply considered when defining the layout of the website. I will discuss all elements separately, and each element is discussed with as much detail as I could think of:
  - Contrast: I used a color scheme generator to choose the colors: [https://coolors.co/](https://coolors.co/). This website uses color theory to allow color scheme generation that allows customizing a color scheme while also retaining contrast and balance between the colors. The part of the website that you read is darker or blue with white text, while forms that you enter is white, allowing easy distinction between where to interact with the page. The text color was also considered in the same way to make it easy to read. The most contrast is between the background (very dark) and the page sections (a shade of blue/grey/teal?)
  - Repetition: Once the user is logged in, the repetition is very noticeable. Each section is in the same box style, and the colors, fonts, and section layouts share the same characteristics. This unifies the website nicely.
  - Alignment: Perhaps the element of the website that took the longest, but all page elements are carefully designed and aligned to organize the data in an easy to follow way. Everything is alignment to the margin and text boxes are dynamically aligned whenever the website page size is modified.
  - Proximity: All alike elements are placed with each other in the same section (e.g. different forms), and all sections are visually distanced using different section boxes. This nicely organizes the website in an easy to use way.
