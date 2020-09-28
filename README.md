a3-Lewis-Cook
your glitch (or alternative server) link e.g. https://a3-lewis-cook.glitch.me/

***********************************************REALLY IMPORTANT THING TO READ BEFORE STARTING THE WEBSITE*********************************************************

So I could get github authentication to work, but not on glitch. You have to start the server on you cmd prompt and then access localhost:3000 from a web browser
to view the github authentication. However, all the database stuff only work inside of glitch. This is the only way I could get github auth to work unfortunately. 
Therefore I also don't have the functionality to where only a certain user can access their own database entries, I would've liked to add that but I can't
seeing as github auth only works outside of glitch and database stuff only works inside of glitch. When you load the website there are two options, "login with 
github" obviously takes you to log into gituhb, then back to the home page, this will not work on glitch as stated before, only through command prompt. The "home"
button simply takes you to the main part of the app where you can add delete and edit data, this will only work in glitch. This is the best workaround I found
for this assignment.

******************************************************************************************************************************************************************

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

The goal of this application is to try and create a task list with a persistant database and github authentication.

At first it was hard for me to understand how the database connection stuff worked but I figured that out with the lectures and some online tutorials.

I chose to use github authentication with the passport package because It seemed to be really common.

I Chose to use sakura.css simply because I like the way it looked

I had to add some stylings for footers, and I also changed the padding on the buttons but thats it.



Express Middleware:

I use express static to give the program a path to where all the files are located

I obviously used body parser to parse json requests.

I used compression to compress any request sent through this server, I'm pretty sure this should improve run times althought I'm not quite sure.

I'm using passport for github authentication.




My app is a simple task manager with mongodb persistance. You can edit delete and add tasks. If you reload the page they will still show up

Technical Achievements
Tech Achievement 1: I used OAuth authentication via the GitHub and passport, see my notice at the top for how to see this.

Design/Evaluation Achievements
Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative

1: I provided informative unique page titles
2: I used headings to organize my content
3: I made link text meaningful -> login to github
4: I provided clear instructions on how to delete update and insert items
5: I kept my content clear and consise, no big paragraphs
6: I provided good contrast with my text and buttons compared to the background
7: I didn't have to use color alone to convey any information, but I still used to for hovering and some other thigns to convey some information to let the user know "hey this is a button"
8: I ensured my interactive elements are easy to identity by changing their colors when hovering
9: My forms have clear associated labels
10: I provide easily identifiable feedback: when they enter nothing into the task bar there is a popup
11: I identify the page language
12: I Reflect the reading order in the code order, it's exactly the same

Contrast: The main way I use contrast is providing vibrant buttons and also vibrant outlines on forms. This allows the users eyes to
instantly be drawn towards the interactable aspects of the website. I changed my buttons to a darker color so I made the text isnide bold and white so it's easy to see.

Repitition: All my buttons look and act the same. Furthermore the same font and text color (besides the buttons) is used throughout the website.
the only time the text isn't similar is the example text in the form which is to showcase that it is a different type of text.

Alignment: My website is alligned pretty simply. Everything is in the middle but all the text starts on the "left" as it is common
to read left to right. All the elements are on the top of the screen as well because that's where your eyes are mostliekly to go to first.

Proximity: I made sure everything is close together but not too close. For example in an 3early rendition my add task button was way closer to 
the tasks than the form, so I evened that space out to make things more clear.





( ᵔ ᴥ ᵔ )