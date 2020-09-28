## Weather Reporting by Kyle Mikolajczyk

https://a3-kyle-mikolajczyk.glitch.me/

- The goal of this application was to make a simple weather reporting site that allows a user to report their own weather and see all the submissions they have done, at anytime.
- The biggest challenge was figuring out how to have the site know what user is logged in. In this case I use ejs which allows node to replace keys in the HTML with elements programatically. When the user logs in, I simply use this to set an input to the username. Using this I can pull the value in that input at any time when using a POST and thus I have their username.
- Simply speaking writing my own collection on the database that contains user and password was simply the easiest. This server does not hash passwords, which I would have done if I had more time.
- The CSS framework I used was Bootstrap 4 because it is very diverse any used everywhere. It looks modern, clean, and all you have to do is specify which classes to you. I wrote zero CSS
  - There was no modifications to the Bootstrap 4 CSS
- The 5 Express Middleware packages I used were the following
  - bodyparser, this allowed to format the body nicely for getting data
  - response-time, this allows for us to keep track of server response time
  - compression, this allows for some basic compression
  - cfrs-Protection, this allows for some basic security protection
  - cookieParser, this allows to use cookies (in this case cfrs protection needs it as well)

## Technical Achievements

- **Another Server Host**: I used my own server rack to host this. I installed node and started listening on the correct port. I spoke to the professor and he said it was okay that I was hosting it myself instead of on AWS or Azure. It was better because I have more processing power and ram and storage and I have control over everything. Down side is that it takes time to set it up and manage, where AWS or Azure I do not have to worry about that.

### Design/Evaluation Achievements

- **CRAP**: I followed the CRAP principles:
  - **Contrast**, Contrast was very important on my site. Starting on the main page and is present on both, I have the site a dark theme with bootstrap 4. This allowed me to make text that is white untop of the dark background allowed for easy seeing text. Next, the biggest emphasis is the title of the page, telling the user where they are. This is with a H1 and is bold. Next, the username and password fields are a lot smaller but still bolded so they are then drawn to enter username and password. The login button uses the btn-primary in bootstrap and simply is a large button so that they are drawn to that next. On the dashboard, the title of the dash is also an H1 and the username is bolded, so that they can tell who they are. As you go down the form medium text is shown so that you can see which fields are what and small labels are used as a secondary, help text.
  - **Repetition**, For the repetition the same theme is used throughout the site. The dark background is the samethroughout, as well as all fonts and Bootstrap 4 styling. The text color is consistant. Input fields follow the same standards throughout such as label in top left, and if help text that is bottom. Buttons are located in similar spots, which are at the bottom of each form such as login and report form, and for logout it is in the same bosition but at the bottom of the header. Buttons are the same style but different colors allowing for repetition but subtle changes that allows the user to tell easially which button they should use for submitting a form versus which buttons they should use to log out or log in.
  - **Alignment**, for the alignment everythign was based on reading from left to right. The inputs, buttons, and tables all work in this way, where the css allows for the elements to all start on the left most justification. Also, a container was used from bootstrap on larger screens so that the elements are left justified, but is centered nicely when the screen gets bigger. Lastly, small labels and all labels for inputs were aligned exactly the same, either above or below the input, so that you can tell which input the text is for as well as tell the importance based on the sizing.
  - **Proximity**, proximity on this page was making sure that distances between like and not alike were good. For example, the pages have headers that contain information about the page. These are spaced further appart than forms and tables so that the relatioship is there but allows the user to see the differences . The spacing between each element (margin top and bottom) was used to be similar spacing all around so that there was breating room bewteen similar elements and more space between not-related elements such as the header etc. which helps the user to navigate easially while still have a good look and feel for the design that allows me to use Bootstrap 4 to its full potential.
