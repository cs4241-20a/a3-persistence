Alexa Freglette
afreglett

Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
Due: September 28th, by 11:59 PM.




What's in my Refrigerator  
https://a3-alexa-freglette.glitch.me/


The goal of my application is to create a website that will help its users keep track of and store items in their refrigerator.

1) Challenges you faced in realizing the application

I struggled the most with getting the data to separate the data and only portraying the data that is for the specified user. 
I was unable to implement this fully, however I believe that I came very very close to. 
In my server I created an app.get that would search my database via find({username: userid}), to find all of the usernames that were similar to the current userid.
I then made this into an array and sent it as a json to the client side. The client side would then take the results and parse it. 
Each element of the array would be sent to build, where (theoretically) it would be build by the client side, just as it would with my add function.

2) What authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
I chose to use GitHub OAuth via passport.js. I believed that passport.js was very well documented and thought it would have been the easiest to implement.

3) What CSS framework you used and why
I decided to use the CSS FrameWork Ionic. I have previously used Ionic and knew much about its functionalities. I also really like how simple and sleep ionic designs look.

4) Include any modifications to the CSS framework you made via custom CSS you authored
From what I discovered, Ionic  does not define table styles in their framework, so I had to create that in my custom css. I also was unable to make the Ionic buttons work with my functions, so I had to customly create those.
The other modifications were mostly adding colors and centering grids. 

5) The five Express middleware packages you used and a short (one sentence) summary of what each one does
Passport, Next, Error, CookieParser, Bodyparser
Passport is an express middleware package that allowed for authentification which I used to implement my Github OAuth
I used the next middleware package to eliminate any hanging, Next will pass the control to the next middleware package. 
I used Error to handle my sign in page (if sign in was successful or unsuccessful), as it is created to handle errors properly on the express code.
I used the Cookie-Parser to parse the Cookie header on the request and expose the cookie data. Using this I can display cookie name & cookie value.
I used the bodyparser to parse all incoming requests.




Technical Achievements
Tech Achievement 1: 
I used OAuth authentication via the GitHub strategy

Another technical achievement I decieded to try was using Axios, which allowed the process of making HTTP requests & the saving of data much easier.
Using Axios at first was a bit awkward, however once I was able to manipulate the middleware to save my token data from my github user and insert it into my database. 



Design/Evaluation Achievements
Design Achievement 1:
CRAP Principles 

Contrast is important as it can be used to determine where a user will pay attention immediate attention to. In my homepage, I wanted my user’s attention to be drawn to the button in the middle of the page, where the button is. For this reason, I outlined the button with a blue border and underlined the text inside of the button to emphasize it. When the button is hovered over, the button changes color. Furthermore, I created contrast on the Welcome Page, by divided the header and body into two different colors, which are separated by a white line. 
On the second page, I wanted my users’ eyes to be drawn to the form. To do this, I surrounded each of the form items with a white box. I believe that this box creates a blatant contrast from the background and the form items.

In my first page there weren’t many elements to apply the proximity principle to. Mainly I wanted to keep the “Welcome Back” text near the logo for my website so the reader associates them with each other. There were more elements to manipulate with proximity on my second page. For example, I decided to keep my elements on top of each other, without any breaks in between the form items, as I wanted to user to fill out each item of the form from top to bottom. I used the principle of proximity in a similar way when creating my table. I wanted my website to have structure, and therefore minimized the amount of “white space” between information that is related.  

For design elements, I mainly relied on the CSS Framework Ionic. I, however, did not feel that the buttons the framework provided fit the theme of my website, as they were bulky and elaborate. The text that was used were all supplied by the Framework, and therefore was consistent. I created a color palette and used those colors (A4B7BB, E8ECED, 76A0B0, f2f2f2, 35262D, FFFBFF). I repeatedly used the same button (both on the welcome page and the table page) to maintain consistency with the design. This principle of consistency/repetition can also be found through my form layout and table display. Perhaps not with my simple website design, but if a website were more complicated, and the layout was not consistent a user will quickly become confused with how to use the website. 

I decided to center my website, since there wasn’t a great deal of text, and I wanted all of my elements to line up with each other in the middle. This center alignment can be found in both my welcome page and in my table page. For my form I placed each of my objects on top of each other, and used the Ionic tool that gave it a slight right aligned to the edge of each object’s white box, unfortunately I could not figure out how to make the Size input box go to the right edge which I found to be incredibly frustrating. Similarly, my table is centered aligned. If this website was more complex, with more elements and text, I would have been able to use alignment as a way to connect each of my elements together. A website with proper alignment will aid in the view’s experience and helping them read/understand the website’s information. 
	



