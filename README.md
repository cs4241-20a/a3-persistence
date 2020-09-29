## Raymond's Initiative Tracker

http://a3-raymond-dolan.herokuapp.com

The goal of the application was to make an initiative tracker for use in tabletop roleplaying games to keep track of combat order.

In realizing the application I had a few challenges in design and scope, since I wanted it to do much more. I wanted to implement a DM view and player view but did not have time. I ran into issues resolving ties when using the database since the format was so different.

I used a simple authentication strategy where I checked the user's password against the one I had for their name in the database. This is because it was easiest for me to implement and I did not have time to do something more complicated.

I used Bootstrap as my CSS framework because it is popular and effective.

The middlewares I used were
- morgan: logs http requests which is helpful for debugging.
- body-parser: helps parse incoming request bodies.
- response-time: records the response time for requests in HTTP servers.
- serve-favicon: serves a favicon for the page, allowing easy use of custom icon.
- connect-rid: generates unique ids for requests. Helpful for debugging.


## Technical Achievements
- **Tech Achievement 1**: I deployed my project on Heroku instead of Glitch. I like Heroku because it lets me work on my local machine then automatically deploy by pushing and merging branches. It is especially nice if the project has a release branch that can be pushed to whenever there is a stable version.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative
1. Don't use color alone to convey information. I made sure my site did not use color to convey information.
2. Provide sufficient contrast between foreground and background. I made sure to choose a color pallete that does not cause a contrast issue.
3. Ensure interactive elements are easy to identify. I had all non obvious interactable elements, like the delete button and the up/down arrows, light up a different color when highlighted so they were obviously interactable.
4. Ensure that form elements include clearly associated labels. All my form elements are labelled clearly with what they represent.
5. Use headings and spacing to group related content. Related content are in boxes to make it easier to understand. 
6. Associate a label with every form control. Each form element has an easy to understand label associated with it.
7. Identify page language and language changes. I included the lang tab in my html.
8. Use headings to convey meaning and structure. I used headings for the app title, the form, and the results area.
9. Keep content clear and concise. There is no extraneous text in my website.
10. Provide informative, unique page titles. I titles the login and main page according to what they are for.
11. Reflect the reading order in the code order. I ordered my page such that the user reads the title, then the form, and finally the results page.
12. Help users avoid and correct mistakes. I provided clear instructions for the more difficult fields, such as initiative bonus, showing that it can be a positive or negative number.

