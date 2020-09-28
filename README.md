## Bill Tracker

https://a3-molly-wirtz.glitch.me

The goal of this application is to provide a simple, intuitive interface to manage a user's bills. In the creation of this application, I faced minor challenges in creating and interacting with my database, using OAuth, and passing cookies around my application. I used a dual authentication method, where users can either sign up or login with a username/password, or use GitHub OAuth. I chose to use OAuth because I wanted the chance to implement a third-party authentication method, which I've never done before. For my CSS framework I chose Bootstrap, a framework I've wanted to get experience in due to its popularity. In addition to leveraging Bootstrap I made various custom CSS tweaks, mostly to background and font color, and simply included them in the HTML tags. I used six middleware packages for this project: 
-	Express static is a built-in middleware that serves static files, such as all HTML files in a /public folder
-	Cookie Parser simplifies the creation, passing, and access of browser cookies 
-	Body parser automatically parses server-side JSON requests
-	Passport is a middleware that assists in authentication, including OAuth through third-party services
-	Morgan automatically logs all requests made to server
-	Favicon sets the website's favicon
-	Dotenv gives access to .env files from server-side code

## Technical Achievements
- **Tech Achievement 1**: Used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: Created a separate signup functionality and page, validating the form and potential new users against existing users in the database
- **Tech Achievement 2**: Hosted site on Heroku

### Design/Evaluation Achievements
- **Design Achievement 1**: I used the CRAP principles from the Non-Designer's Design Book readings. 

I implemented three UI pages in this application: the login page, the signup page, and the main page. 

When it came to repetition, I was very consistent in all my pages. Two colors (#13a2b8 as a primary color and #9b8679 as an accent color), two heading sizes (H1 and H5), and two font colors (black and white) were used across my application. For layout, I repeatedly used Bootstrap's container element to provide scalable left and right-hand margins, and set each element's width to span the entirety of the container. In addition, a repeating margin rule for non-grouped elements (mt-5 and mt-5 or mt-3) was applied. Of all the principles, I felt this was the one that came most naturally, but I still made a conscious effort to consistently repeat elements, and was pleased at the unifying effect it had on all my pages. 

Alignment was a design principle which made a big difference in the feel of my UI once it was applied. As mentioned in the repetition section, I set all my elements as full width (i.e. aligned to both margins) and set the elements that weren't full width to align on the right margin. My final alignment was a center alignment for my headers as well as alternative login options. While refactoring my UI from assignment two for this submission, I noticed that my default impulse was to align everything to the center, as the book pointed out before. Although I made a conscious effort to stay away from center alignment, I realize that much of my application still reflects that impulse. I believe it will take more practice in design to move out of the center-align comfort zone in the future. 

I used proximity grouping to organize flow and group elements in my application. On my signup page, all elements on the form are grouped tightly together, while the header and the alternative login options are spaced further apart. This shows a distinction not only between the elements, but clarifies the path the user should take when interacting with this application. Similarly, on the login page, the grouped elements (such as the header and sub header, the form elements, and alternative login options respectively) are all grouped closely to each other, while spaced apart from other grouped elements. Immediately after aligning my elements I saw that my page become more organized, easier to understand, and clearer to the user when they are “finished” with the page.

To provide contrast, I attempted to place the most emphasis on the headings and primary action items (i.e. buttons). On the login page, my eye first goes to the large text at top, then to the login button. This follows the path most users will take on this page: read the title, fill out the form, and press the button to log in. In this sense, the signup page is identical. The main page is busier than the other two pages, so I used a contrasting color on the form submit to draw attention to the end of the form submission. Contrast was the design principle I struggled with the most to apply, and I had trouble trying to balance element repetition and cohesiveness with contrasting elements. 

