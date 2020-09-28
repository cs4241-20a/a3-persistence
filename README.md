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
