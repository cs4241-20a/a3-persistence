Readme
---

## A3 Virtual Shopping List

Website link: https://a3-ryan-cirella.glitch.me/

The goal of my application is to hold a list of items for a grocery store shopping list.

*Usage:*
- To add an item, enter it in the input box and click "Add Item"
- To remove an item, make sure the input box is blank and click on the item in the list
- To edit an item, enter the new value in the input box and click on the item to edit in the list

I faced challenges with using the server to get requests and responses to return the correct JSON I needed for the app to function correctly.
It was hard learning how to do this as I've never worked with express server before.

The authentication strategy I chose was to just have users create accounts or login as a previously made account. I chose this because github authentication was not working for me and letting users make a username and password would work correctly.

For CSS framework, I used the sakura theme. It was classless and minimalist which suited my application.
Its default colors also fit well with the concept of a shopping list with familiar colors one would expect around paper.
I only made one modification to the CSS because everything worked correctly without changes. I changed the text color to red for the username and passoword on the login screen.

The five Express middleware packages I used were:
- body-parser, for easy JSON parsing on the server side from the client.
- compression, to automatically compress server responses.
- response-time, to log how long each aspect of the website takes to load.
- morgan, to log all of the HTTP requests made from the website.
- connect-timeout, to cause the website to timeout if things take too long to load.

## Technical Achievements
- N/A

### Design/Evaluation Achievements
**Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
- Clear and Concise: Short descriptions on all buttons and the lists
- Heading Meaning: Heading on top of list describes its contents
- Input Proximity: The input field on the login and list is right next to its descriptor.
- Easy Feedback: An alert appears if the user enters a username or password that is incorrect.
- Layout Sizes: The websites layout of being centered gives accessibility no matter what device it is being used on.
- Indicate important information: Username and Password have asterisk showing necessity.
- Descriptive Page Titles: Page tital in browser shows exactly how many pages in app and which one you're on.
- Instructions on What User Provides: The login page provides recommendations for the password
- Contrasting Colors: The button, header and text colors contrast the grey background of the app
- Descriptive Colors: The username and password fields are red showing they are required to the user.
- Consistent Navigations: Buttons link all pages of the app together.
- Clear Instructions: Instructions for the user are short and concise.

**Design Achievement 2**: I followed the CRAP principles in the Non-Designer's Design Book readings.
- *Contrast*
- The site’s contrast begins with the color pallet on it for the headers, text and buttons. The header and text are black and the buttons are a dark shade of green. These both contrast the light grey background immensely to stand out to the user and grab attention. The big and bold header should be the first thing the user’s eyes focus on as it contrasts the rest of the page. Then, the label and text box below it should be the next thing to focus on. The buttons then should get the user’s attention because their color starkly contrasts the rest of the page. As the list fills up, it should then be the last thing looked at once complete for the user’s own use.
- *Alignment*
- Everything in the layout is aligned to an equal offset from the left and right to the page and then aligned to the left. Some elements such as input boxes are next to a label which describes what must go in the box from the user for ease of use purposes. The login page has most objects on the page aligned to the left, but the login and create account buttons are next to each other. They are both still aligned left on the line. The line to the left of the page ensures nothing is in uneven alignment for the page. The list page also has a label and input field on one line with everything else aligned to the left.
- *Repetition*
- For the list page, the buttons repeat themselves to get attention from the beginning all the way to the end of the page. The list items will stack one on top of the other as the user adds them in a non-changing format. The login screen has the required text repeat itself for both the username and the password to get the user’s attention twice as to what’s required for log in. The buttons at the bottom of the login page repeat themselves right next to each other as each is for a similar function. The input fields also repeat on the login page right above one another for two inputs from the user.
- *Proximity*
- For proximity, items pertaining to each other are right next to each other. On the logon page, the username and password labels are each right above their respective input fields. There is also text below the password field giving advisory to the user on what the contents of their password should be. The login and create account button are right next to each other at the end of the page in order to both pertain to the sign on. The header at the top has subtext under it directing the user to enter in their credentials for the login. For the list page, the grocery item label and input box are right next to each other. Then, the entire list and its interactive elements all are one on top of each other on the rest of the page.
