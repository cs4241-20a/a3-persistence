Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
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

# Food Tracker

## Webware assignment 3

**Jordan Gold**
Link to project: http://a3-Jordan-Gold.glitch.me  

For assignment 3 I developed a food/meal tracker which lets you enter any foods you ate, when you ate them and for what meal, and their calorie content to keep track of your daily habits. Once a food/meal has been entered you can always edit a field in an item or delete an item at will. All items are stored in MongoDB and are kept seperate between users. The server was created using express to provide a simple server that did everything it needed too.  

In creating this application there were a few challenges that I came across. The largest problem was authenticating users. It proved to be a more complicated process than I presumed and took me longer than I wanted to spend implementing it. The other major problem I came across was user input and validation. When a user initially entered info the input fields provided forms of input validation but when editing an entry I used the prompt function which does not have built in input validation of any kind. This meant that I had to disable editing of the time field to make sure the data was always valid.  

I chose IIIIIIIII  authentication strategy. I chose this strategy because it was very easy and simple to implement.  

For CSS frameworks I went with the simple but still nice looking option of sakura. Sakura is a minimal classless css framework that allowed me to style my website nicely very quickly. All I had to do was download the css file and set the html to use it. The nice look combined with the rapid deployment time made it a very good choice. While it may not look as complicated as something like bootstrap I still think it looks nice enough and is much more lightweight than bootstrap. I did make slight modifications to some of the css elements to tweak it to my liking along with making slight use of divs to nicely space content out on the page. These were just very small changes I made to some buttons, items in table cells, and a div. I also used normalize before Sakura as it was recommended to normalize some parts before Sakura.  

The five express middleware packages I used were serve-static, body-parser, passport, helmet, and serve-favicon.

- **Serve-static**: This middleware package will serve any static files I have in my website such as html files, javascript, and css files automatically when requested by the client.
- **Body-parser**: This middleware would parse the body of any recieved post requests and transform it into easily used json.
- **Passport**: This middleware handles all the authentication for users easily and simply.
- **Helmet**: This middleware provides an extra layer of security on all get and post requests sent from the server, it adds a large number of fields to the requests which try to prevent things like spoofing and more.
- **Serve-favicon**: This middleware package conveniently serves up a favicon for my website in one easy line.

### Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements

- **Accessibility Changes**: I followed the following tips from the W3C Web Accessibility Initiative to make my website more accessible.
  1. *Provide informative, unique page titles*: I did this by changing all the titles of my pages to describe exactly what their function was.
  2. *Write meaningful text alternatives*: I did this for all buttons on my page that did not have text in them by adding a title attribute and clearly writing in the buttons purpose there.
  3. *Keep content clear and concise*: I did this by using a minimal amount of text on my site and not adding anything extra or misleading.
  4. *Provide sufficient contrast between foreground and background*: I did this by making sure all text color on my site is a dark color and giving any buttons a different colored background to make it apparent that they are buttons.
  5. *Ensure that interactive elements are easy to identify*: I did this by adding "on hover" css styling to all buttons on the page that make it very obvious they are buttons when they are hovered over.
  6. *Provide clear and consistent navigation options*: I did this by adding the page section you are on to the title of the page along with making a sensible page flow. Login takes you directly to the main application so there is no where to get lost in the process.
  7. *Use headings and spacings to group related content*: I made sure to have reasonable amounts of space in between the three different areas of my page to provide a clear boundary between them.
  8. *Identify page language and language changes*: Every page has the lang="en" on it to make it clear that the pages are written in English.
  9. *Use mark-up to convey meaning and structure*: I used div tags and markup to clearly break the three sections of the page up in the HTML.
  10. *Reflect the reading order in the code order*: The elements in the code match up very well with the logical way that the information is presented. Even when CSS is removed from the page the website still makes sense and flows correctly.
  11. *Ensure that all interactive elements are keyboard accessible*: All elements were made sure to be keyboard accessible. The entire page can be navigated using the tab button.
  12. *Help users avoid and correct mistakes*: The user is given feedback if something they entered is not correct. Along with that the input fields are set specifically to aid as much as posible in not entering invalid input.
