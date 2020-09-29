## MTG Custom Card Creator

http://a3-luke-deratzou.glitch.me

My application is a simple web app that stores information about custom cards in the trading card game Magic: the Gathering. After a user registers and logs in, they can make a custom card, filling out information about it. I also have a tutorial page to explain what each of the fields means. 
The main challenges I faced were getting pieces to communicate with each other. Specifically, I at first ran into issues with getting the server to communicate with the database, but I figured it out after studying the documentation. I also had issues wtih Passport, but were able to resolve them after getting some assistance. Design wise, I was hoping to work on getting a card to display for the user, but it ended up being too complicated.
The authentication strategy I chose to use was simply getting the user to log in, check if their credentials match the credentials in the database, and if they do I would let them be logged in and set their username as a localStorage variable. From there, I got their account's data via this localStorage variable. This was mainly done out of simplicity.
The CSS framework I went with was Bootstrap. I am quite familiar with it and I enjoy using its navbars and row/column divs. I used minimal custom CSS, only for some interactivity. However, I did download a Bootstrap-compatable custom CSS file, named bootstrap.min.css. The link to it is https://bootswatch.com/superhero/
The first Express middleware package that I used was the next() function middlewear, which is used for letting the application proceed assuming there are no errors. The second middlewear I used was the bodyParser, which helped with extrapolating json that was sent from the client to the server. I used this throughout my server file. The third middlewear I used was the express.static middlewear, which simply serves all the files in the directory given to it. The fourth middlewear I used was passport, which was needed to get the GitHub OAUTH working. Finally, I added a cookie-session middlewear, because I wanted to experiment with it and see what it does. This middlewear simply stores a cookie for the client.
For testing my application, I created a user with the following credentials:
username: LukesTester
password: SecretPW123
This user has 3 custom cards.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy to implement a way to login via GitHub. I store the username and the token in my accounts collection, and associate the GitHub username with the data. I followed a guide on Medium, which helped me with implementing the passport code.
https://medium.com/swlh/node-and-passport-js-github-authentication-e33dbd0558c

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative. Below are the following 12 tips that I followed and what I did to follow them:
1) Provide informative, unique page titles. I added page titles that were different for my two pages. The first page just has my website name (as it is the homepage), and the page with the data is called Data • MTG Custom Card Creator, as I was following the suggestion to put the most important information first.
2) Use headings to convey meaning and structure. I used headings in my website to make sure that my information was apparent. Specifically, in my tutorial page, I used headings to organize the information and make it easier for the reader to understand each section.
3) Write meaningful text alternatives for images. I did this in my tutorial page, where I had six images showing the different locations of the card information on a sample card. The alternative texts clearly described not only which attribute it was, but also where the attribute was on the card and what it was for the example.
4) Provide clear instructions. For the sign up page, I had clear instructions for how to create a password. I also created a tutorial page to give information for those less familiar with the game on what each of the six fields mean.
5) Keep content clear and concise. I made sure for my tutorial page to include information but to not include too many examples or details, as that would overwhelm the reader and make the page look messy.
6) Ensure that form elements include clearly associated labels. I made sure to add labels to each of my form options and put them above the inputs (with the exception of radio/check buttons, where they were to the right of them).
7) Ensure that interactive elements are easy to identify. I made sure that the colors are contrasting enough for the links that they would be noticable. I also made sure to use buttons with clear instructions so that the users knew that they were interactable. The form elements were clearly labeled to make it apparent that input was required. Finally, I made sure that there was enough emphasis through hovering that the navbar was interactable (changing the cursor and color when you hover over a link).
8) Provide clear and consistent navigation options. I made sure to use the exact same navbar for the data page and the tutorial page to keep it consistent. I did not include a navbar for the login/signup page because I do not want users accessing the data page, so I only used it at one place. The navbar is where I handle all the page navigation except for logging in, which brings the user to the same page everytime (data), as I wanted to keep it consistent.
9) Associate a label with every form control. I originally used other tags, but I have since added a label to all of my form tags, in both the signup/login page and the data page.
10) Include page language and language changes. I made sure to include the lang="en" tag to specify what language of the website was in.
11) Help users avoid and correct mistakes. Whenever a user makes a mistake in the sign up or login, I send them a clear error message, to help them fix their mistake. For example, if their passwords do not match, I alert them of that fact, or if their password is too weak.
Provide easily identifiable feedback. (lets do this one)
12) Reflect the reading order in the code order. I made sure that all of my html elements are in the right order, such as having my headings being the first element to start the section.