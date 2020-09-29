Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template 
===
Saniya Syeda

Glitch Link: <https://a3-saniya-syeda.glitch.me/>

Heroku Link: <https://a3-saniya-syeda.herokuapp.com/>

## Shopping List
This application is a simple grocery list where users can add, modify, and/or delete items from their shopping list.
- I used the sakura.css template under the Class-less frameworks category for styling
- I used 5 Express middleware packages:
  - body-parser, passport, passport-local, static, and session.
- The results table prints to console along with the database response

## Technical Achievements
- **OAuth authentication**: I tried to install and use the middelware passport.js and UserSchemas to implement OAuth authentication, however I am not sure if it is functional. I created dummy user credentials in MongoDB that the user can input to get access.
- **Hosted on Heroku**: I hosted my app on the Heroku service as well. I have never used Heroku before, so it took some getting used to, but I was soon able to understand how it worked with Github deployment. I liked that it allowed users to log in directly with Github and connect to a project, which made it easy to sync changes. However it only lets you deploy a project from Github itself, and doesn't let you edit with the online Heroku service (from what I've seen, I might be wrong), which Glitch does provide. Heroku has a deploy feature that builds and installs and dependencies from the project in your Github repo, which was also convenient. Overall, I think Heroku has a lot more interesting features that can be helpful for larger projects. Glitch seems better for more simple apps since it is relatively easy to understand and use.
### Design/UX Achievements
- **W3C Hints**: I used 12 tips from theW3C tips for writing/designing/development:
  - Provided informative page title with small summary for users.
  - Used headings for the forms and subsections to structure.
  - Provide instructions for forms, for example how to delete and modify list elements, using placeholders for input
  - Keep content readable and understandable, no large paragraphs of content
  - Contrast between foreground and background, form is within a highlighted box and titles are bold.
  - Button focus to highlight where user should submit
  - Form elements are labeled accordingly.
  - Provided alt text for shopping cart image
  - Form input is required and displays identifiable feedback if user does not input and still submits
  - Used for, name, and id attributes for all form controls
  - Provide examples of possible input for form ("apples" or "paper towels")
  - Reflect reading order in code, image is placed within header tag along with headings so the content order makes more sense
 - **CRAP Principles**: I used the four CRAP principles to try and improve the UX of the app, as described below:
    - *Contrast*: To create contrast on the pages of the app, I tried to emphasize different sections of the page to make one or the other stand out. For example, on the login page, the title is in large font and bold, and the button is a brighter color than other elements on the page against a plain white background to draw attention to it. On the shopping cart page, I used the same idea. Making the sizes of fonts different, for example the label for input was larger vs the example text which was small and light font to show it is just a hint and not distract. The shopping cart icon was not large but the lines of the vector itself were bold to communicate the purpose of the app.
    - *Repetition*: Within the app, I used repeating elements to maintain consistency between elements and pages. For example, the sakura.css template I used has a predefined set of colors and rules applied to the HTML. It uses the same font (with slight deviations) throughout the app, only varying aspects such as text style (italicized or bold), weight, or color. Using the same font helps to give the page a cleaner and organized look. I also tried to maintain the same basic styling/layout for both the login and grocery list form, with a gray background, placeholder text, labels, and matching font. The buttons also remained the same color, placed slightly differently. Using the same fonts/colors/minimalist style throughout helps unify both pages of the app into a more cohesive sequence.
    - *Alignment*: To align different components of the app, I tried to take into account the placement of text/images in relation to eachother. Each element is supposed to have a visual connection to something else on the page so I thought about how to place text/components to display that relationship. Almost all of the text in both pages is aligned to the left with the exception of the button text. The button text is intentionally centered just because it is already a separate interactive element from other page elements. Aligning text to the left or right provides a hard vertical edge and gives a cleaner look. The forms are aligned to start at the same left edge as the title and other text. The shopping cart icon is right aligned so that the page is read in logical order. 
    - *Proximity*: Similarly to the alignment principle, the proximity principle creates a relationship between certain elements. To achieve this, I tried to group components that were related in function and so would logically be visualized as one singular entitity. For example, in the login form, the username and password input are placed closely on top of eachother and aligned the same within the gray form box in order to show that both are required. The submit button is outside of the form box, but is close enough to the form to show it is part of the same group. On the shopping list page, the todo list items are grouped closely together with a slight gap from the input form/button to identify them as one list but not completely separate them.
