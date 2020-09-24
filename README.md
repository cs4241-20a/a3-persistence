# Food Tracker

## Webware Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

**Jordan Gold**
Link to project: https://a3-jordan-gold.herokuapp.com  

For assignment 3 I developed a food/meal tracker which lets you enter any foods you ate, when you ate them and for what meal, and their calorie content to keep track of your daily habits. Once a food/meal has been entered you can always edit a field in an item or delete an item at will. All items are stored in MongoDB and are kept seperate between users. The server was created using express to provide a simple server that did everything it needed too.  

In creating this application there were a few challenges that I came across. The largest problem was authenticating users. It proved to be a more complicated process than I presumed and took me longer than I wanted to spend implementing it. The other major problem I came across was user input and validation. When a user initially entered info the input fields provided forms of input validation but when editing an entry I used the prompt function which does not have built in input validation of any kind. This meant that I had to disable editing of the time field to make sure the data was always valid.  

I chose the local authentication strategy. I chose this strategy because it was very easy and simple to implement and I don't really care much about security in this application.  

For CSS frameworks I went with the simple but still nice looking option of sakura. Sakura is a minimal classless css framework that allowed me to style my website nicely very quickly. All I had to do was download the css file and set the html to use it. The nice look combined with the rapid deployment time made it a very good choice. While it may not look as complicated as something like bootstrap I still think it looks nice enough and is much more lightweight than bootstrap. I did make slight modifications to some of the css elements to tweak it to my liking along with making slight use of divs to nicely space content out on the page. These were just very small changes I made to some buttons, items in table cells, and a div. I also used normalize before Sakura as it was recommended to normalize some parts before Sakura.  

The five express middleware packages I used were serve-static, body-parser, passport, helmet, and serve-favicon.

- **Serve-static**: This middleware package will serve any static files I have in my website such as html files, javascript, and css files automatically when requested by the client.
- **Body-parser**: This middleware would parse the body of any recieved post requests and transform it into easily used json.
- **Passport**: This middleware handles all the authentication for users easily and simply.
- **Helmet**: This middleware provides an extra layer of security on all get and post requests sent from the server, it adds a large number of fields to the requests which try to prevent things like spoofing and more.
- **Serve-favicon**: This middleware package conveniently serves up a favicon for my website in one easy line.

### Technical Achievements

- **Tech Achievement 1**: Hosted project on a different hosting service. I used Heroku for this. Overall I enjoyed the experience more than using glitch as often glitch seems to act up in strange ways. The biggest benefit is automatic code deploy from git with every push, so no more constantly having to update the glitch project if you make a slight change, it just does it for you. Otherwise it is just a more fluid and professional experience which makes it enjoyable over

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
