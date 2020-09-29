Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 28th, by 11:59 PM.

## CookBook.js
Submitted by Noah Parker, nparker@wpi.edu


Glitch link: https://a3-noah-parker.glitch.me/

CookBook.js is a simple application that allows users to compile and save a list of recipes. The user can either add their own recipes, or collect recipes added by other users, or both.
The goal of this application is to allow people to centralize a list of recipes, and store it in the cloud to avoid data loss.

Bootstrap was used for the CSS Framework for this project.  
The 5 express middleware packages used for this application (not including mongodb) are:   
body-parser - used to parse JSON request bodies from the client  
cookie-parser - used by the passport middleware to manage the session cookies  
passport-github - the middleware package responsible for OAuth through Github  
passport - base passport middleware package, used for OAuth  
express-session - Used for managing the current session, and passport  


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy, using the Passport middleware package  
Users can authenticate through github, and their user data is then used to create user-specific "CookBooks", containing the user's liked/added recipes.  


### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...  
1.) All images on the site used for decoration purposes have a alt="..." attribute, see browse page.  
2.) Navigation is done through the standard <nav></nav> tag. (see toolbar at the top of each page)  
3.) All forms are provided with an associated label tag (see "Add Recipe", or "Delete Recipe" actions)  
4.) Informative Page Titles - Each page is given a descriptive title.  
5.) Headings convey meaning and structure - Headings are used in each page to specifically describe the information context.  
6.) Content is organized cleanly anc concisely - The UI is very simple, the pages are not over-crowded.  
7.) Forms are accompanied with clear instructions - Adding/Removing recipe forms have clear instructions.  
8.) Provide Clear/Consistent navigation options - The Navbar implented is consistent between all pages.  
9.) Provide Clear Instructions - Landing page once a user has signed in includes instructions on how to use the site.  
10.) Use Headings/Spacing to group related content - home page and browse page group content nicely/concisely.  
11.) Use Markup to convey meaning and structure - Recipe display uses many markup tags to format information nicely.  
12.) Provide Easily Identifiable feedback - If a user makes a mistake, clear error messages are presented.

