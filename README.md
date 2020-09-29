Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
https://a3-mario-castro.glitch.me/
Mario Castro


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
- (10 points) Implement OAuth authentication with Github

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.
  
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. Which element received the most emphasis (contrast) on each page? How did you use proximity to organize the visual information on your page? What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? How did you use alignment to organize information and/or increase contrast for particular elements. Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## To Do App

a3-mario-castro.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
  - The goal of the application was to create an easy to use to do list maker.
  
- challenges you faced in realizing the application
  - The challenges I faced in realizing the application was mainly avoiding spending all of my time slowly tweaking HTML and CSS aspects to get exactly the look I was imagining. 
  
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
  - I chose Github because it was the one that was required and wasn't just local. 

- what CSS framework you used and why. include any modifications to the CSS framework you made via custom CSS you authored
  - I used bootstrap because I have heard from peers that it works well on mobile devices
  - The only modifications I made to the CSS framework via custom CSS were small margin and padding things on particular elements to better achieve my creative vision.
  
- the five Express middleware packages you used and a short (one sentence) summary of what each one does
  - The middleware I used was..
  - body-parser - For parsing the body of HTML requests
  - compression - For compressing HTML requests to save data
  - express-sessions - For keeping track and managing of user sessions.
  - cookie-parser - For parsing said cookies as part of express-sessions
  - passport - For github authentication

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
  - 1 DESIGN TIP : Provide sufficient contrast between foreground and background. I provided sufficient contrast between foreground and background by making sure the buttons all had vibrant colors compared to the background
  - 2 DESIGN TIP : Create designs for different viewport sizes. I made sure my design was usable on all view sizes.
  - 3 DESIGN TIP : Don’t use color alone to convey information. All of my buttons have text as well as color to indicate what they do. 
  - 4 DESIGN TIP : Ensure that form elements include clearly associated labels. All of my forms have placeholder text that labels what they are used for.
  - 5 DESIGN TIP : Use headings and spacing to group related content. On my task editing page, all the editing buttons (add, delete, new task) are all located near eachother on the right hand side of the page.
  - 6 DESIGN TIP : Include image and media alternatives in your design. I included a github logo icon along with the log in with github button to further communicate the association with github
  - 7 WRITING TIP : Keep content clear and concise. I tried to keep text on the site to a minimum and only said what was needed.
  - 8 DEVELOPING TIP : Ensure that all interactive elements are keyboard accessible. All of my interactive elements can be used with just the keyboard.
  - 9 DESIGN TIP : Provide clear and consistent navigation options. All navigation elements are clearly colored and different than any other elements on the page. 
  - 10 WRITING TIP : Provide clear instructions. Clear instructions are provided for both pages of the website. Users are told to sign in to start making a to do list, they then are clearly shown how to add a task. 
  - 11 DEVELOPING TIP : Use mark-up to convey meaning and structure. I used the nav markup for the navbar at the top to convey structure. 
  - 12 DEVELOPING TIP : Reflect the reading order in the code order. All the HTML elements are in the order in which they would be read