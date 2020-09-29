## Recipe App
Heroku URL: https://a3-sammoran.herokuapp.com/


My application allows users to create and share recipes. Users can login with Github and then add
recipes to a database. ALL recipes in the database are publicly visible on the "All Recipes" page.
Only the user who added an individual recipe can modify/delete it. A list of all recipes belonging
to an individual user is viewable under the "My Recipes" tab.


### Challenges
I struggled somewhat with authentication, as well as various aspects of deployment. I decided to deploy
on Heroku, as I've hosted websites there in the past, but it's been a while since I used Heroku so
I had to refamiliarize myself with how everything worked.


### Authentication
I used the Github authentication strategy with Passport.js because it seemed the most straightforward one.


### CSS
I chose Bootstrap css as my CSS framework because I've used it previously and liked it. I made a few
very minor modifications, mostly to padding/margins or centering elements, mostly with inline style
tags rather than dedicated CSS.


### Express Middleware:
- compression: Compresses HTTP responses.
- body-parser: Middleware for easily parsing the bodies of HTTP requests.
- ejs: Templating library that allows for reuse of components and composition of HTML pages from components with variables.
- passport: Authentication library, using the GitHub strategy.
- express session: Handles browser sessions for users. Works with passport to keep track of users' login state as they browse the site.

## Technical Achievements
- **Used Github OAuth authentication with PassportJS**: This took me much longer than expected, as I had difficulty finding accurate and up-to-date documentation about using Passport with a Github strategy. I
struggled for a bit with the auth callback URL before realizing that 1) Passport is really just Express middleware and 2) I had to set the proper callback URL in GitHub for it to work properly. I managed to figure
it out, and even added a bit of custom middleware that checks if the user is logged in for several routes.
- **Used EJS for HTML Templating**: I've previously used web frameworks like Flask and Django, which
have a templating language built in, and I wanted to get something similar for this application because I wanted to have a navbar at the top of every page without having to copy-paste the HTML on
every view. I tried express-handlebars at first, but found it didn't play nicely with Vue, which I also used, so I switched to EJS. I had to learn the syntax and figure out how passing variables worked, which took a little bit of doing, but eventually I got it working. I think this is very useful for maintainability because it allows elements like the header to be defined in one place rather than in each file.
- **Implemented Custom 404 Page**: While developing, I got very tired of looking at ugly server messages when I tried to access an invalid (usually misspelled) URL. So I created a custom 404 page
that Express will serve if the requested route is not recognized. Nothing fancy, but it's much better
in my opinion than a plaintext error code.

### Design/Evaluation Achievements
- **Followed CRAP principles from Non-Designer's Design Book**:
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
  * Proximity
  Proximity was one of the most straightforward design principles to me. I tried to deliberately place elements on the page based on where each element made the most sense in terms of conveying pieces of information
  related to one another. For this app, this meant visually grouping elements of distinct recipes with one another and away from other recipes. I've worked with Bootstrap in the past and I've gotten in the habit of
  placing forms as well as anything that displays data inside of a Card element. I find that being in a card gives a nice smooth outline and creates a subtle but important separation between different visual elements.
  For instance, on the page where recipes are displayed, each recipe is nicely bordered to clearly indicate where one ends and another begins.
