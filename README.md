## Motocross Results Tracker

http://a3-nconill13.glitch.me/login

Please use full screen.

This application allows users to log into an account that allows them to track past
motocross race results, including the date, track, class they rode, and their finishing
position. 

I faced an extreme amount of challenges, specifically in not being able to adjust this 
project to correctly use mongodb. While I used my A2 project as a starter, I was unable
to correctly adjust the form to connect to my cluser, thus rendering the database entries
and user databases rather useless.

I used the passport.js authentication strategy because it was the easiest to implement, and
had plenty of searchable guides.

I largely modified the CSS framework, as visible in the CSS files. While it was based off
the framework of Water.css, I created many updates to allow it to stylize to the theme
of motocross, and specifically the two background images.

The five Express middleware packages I fully used are as follows: (1) passport - an authentication
strategy; (2) body-parser - parses HTTP request bodies; (3) bycrypt - enforces password hashing;
(4) morgan - makes logging into Node.js HTTP servers easy; (5) method-override - returns a 
new middleware function to override the req.method property with a new value.

## Technical Achievements
- **Tech Achievement 1**: I implemented authentication through passport.js.

### Design/Evaluation Achievements
- **Design Achievement 1**: I included the following tweleve tips from the W3C Web 
Accessibility Initiative: (1) I made link text meaningful, such as creating account; (2)
I provided informative headings regarding entering new races and viewing prior entries;
(3) I provided sufficient color contrasts between the foreground and background; (4) I provided
easily identifiable feedback such as no email being associated with the log in; (5) I used
heads and spacing to group related content, such as the form for new entries and the table
for existing entries; (6) I didn't use color alone to convey information; (7) The interactive 
elements are easily identificable as dark grey buttons; (8) I help users correct mistakes by
providing alerts; (9) All interactive elements are keyboard accessible using tab to manuever; (10)
A label is associated with every form option; (11) There is clear and consistent navigation options 
between logging in, logging out, and creating an account; and (12) conent is overall clear and concise.
- **Design Achievement 2**: I followed the CRAP principles. For contrast, since the
backgrounds tend to be light colors of brown, I used a light accent of grey for boxes
surrounded black text. The repetition is the same from the login screen to the main page,
including the same style of text, buttons, etc. The alignment in full screen is essential
to the layout of the app, as it is edited through CSS in order to line up as necessary
to allow the picture of the motocross rider in the background to be seen. Finally,
proximity exists in that the new entry form is grouped together, just as the existing
entry form is far enough away to be its own element on the page.
