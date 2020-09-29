P    Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows the entire dataset residing in the server's memory
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Use of at least five [Express middleware packages](https://expressjs.com/en/resources/middleware.html). Explore! 
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:

HTML:
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two simple pages for this assignment, one that handles login / authentication, and one that contains the rest of your application. For this assignment, it is acceptable to simply create new user accounts upon login if none exist, however, you must alert your users to this fact.

CSS:
- CSS styling should primarily be provided by your chosen template/framework. Oftentimes a great deal of care has been put into designing CSS templates; don't override their stylesheets unless you are extremely confident in your graphic design capabilities. The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server. See the [previous assignment](https://github.com/cs4241-19a/a2-shortstack) for reference.

Node.js:
- A server using Express, at least five pieces of Express middleware, and a persistent database (mongodb).

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authenticaion or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Recipe App

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does
Express Middleware:
- compression: Compresses HTTP responses.
- body-parser: Middleware for easily parsing the bodies of HTTP requests.
- ejs: Templating library that allows for reuse of components and composition of HTML pages from components with variables.
- passport: Authentication library, using the GitHub strategy.
- express session: Handles browser sessions for users. Works with passport to keep track of users' login state as they browse the site.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the CRAP principles from the Non-Designer's Design Book.
  * Contrast: My website overall is fairly plain. I stuck to mostly black, white, and gray because I feel that it contributes to a clean and uncluttered feel. I chose to emphasize only the "action" buttons
  (for adding, deleting, and editing a recipe) because these actions are what the site is all about. Not only are these buttons notably larger than other buttons and components and separated vertically somewhat
  from other components, they are also the only brightly-colored elements on the site. My goal was to make it very clear to the user what the purpose of each form was immediately upon loading the page. There are a handful
  of other elements on the site that are emphasized (the popup after you attempt to add a recipe and the button to add an ingredient to a recipe), but I took care to make sure that they are both sort of medium-priority;
  the popup is lightly-colored and the button to add an ingredient is just a very dark gray.
  * Repetition: I re-used as many similar elements as possible in designing my frontend. I used Bootstrap CSS as my CSS framework, which comes with components that already have a fairly unified design -
  smooth, clean-feeling font and rounded borders for most components. I also used EJS to put a navbar at the top of every page, which I think makes the site feel MUCH more cohesive and serves as a sort of guide
  to the site; at any point, a user can click a link to access almost any part of the site.
  I made use of Card elements in almost every page - each recipe in the "My Recipes" and "All Recipes" page is its own card, as well as the forms for adding a new recipe. I also reused the same layout for
  adding and editing a recipe, with minor functional changes via ejs templating, to keep them consistent. Finally, the "action" buttons are all the same size, which I think reiterates the idea that every
  major action is associated with a large, easily identifiable button.
  and brightly colored.
  * Alignment
  I used Bootstrap's container, column and row system to align my UI elements. By default, elements within a container will be centered horizontally on the page, so that was taken care of for me. However, in
  aligning buttons, inputs, and other elements within a card div, elements typically weren't centered by default and I wasn't quite satisfied with the sizing and spacing. I chose to center-align these elements, and
  added some margin around buttons. I also made buttons larger so they filled up more of the space they took up. This aspect was simultaneously the most difficult and easiest; Bootstrap does most of the heavy lifting
  automatically, but I found that in cases where I didn't like the default Bootstrap styling, it was surprisingly difficult to figure out which properties to override in order to better fit my idea. I ultimately managed
  to align everything to my satisfaction, but it took me a surprising amount of time to get it just right.
  * Prox
  Proximity was one of the most straightforward design principles to me. I've worked with Bootstrap in the past and I've gotten in the habit of placing forms as well as anything that displays data inside of a Card element.
  I find that being in a card gives a nice smooth outline and creates a subtle but important separation between different visual elements. For instance, on the page where recipes are displayed, each recipe is nicely
  bordered to clearly indicate where one ends and another begins.   I   