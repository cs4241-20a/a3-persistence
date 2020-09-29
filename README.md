# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
Bryce Corbitt 

http://mbsr.wpi.edu:2020

## ~~Glitch~~ Drive++
***Drive++*** is a new and improved version of my prior assignment, **Glitch Drive** that has an account system and is no longer served via Glitch. Users may sign in/up using their Google account. Uploader name and upload title may be edited after upload. A password key is no longer needed when submitting a new file; edit and delete controls only show on the files tied to your account. Clicking the "Your Uploads" button on the Home Screen while being logged in will take you to a custom upload page that only shows your uploaded files.

### Screenshots:
#### Home Screen
![Home Screen](https://i.imgur.com/kUgAy4c.png)
#### Home Screen (logged in)
![Home Screen (logged in)](https://i.imgur.com/x01uLqc.png)
#### Uploads Screen
![Uploads Screen](https://i.imgur.com/xI0WY90.png)

### HTML:
- text input and file input tags are used in the form submission.
- A custom "user" view has been added to show only uploads from the authenticated user.
### CSS:
I used the Bootstrap framework in this project. See `/public/css/styles.css` for the rules I wrote.

Custom framework overriding styles include the following:
- Custom 'panel-title' text font size and style.
- Element selectors are used multiple to properly format audio, video, and image embeds within the feed.
- ID selectors are used on the buttons for each of the file entries, as well as for content in the navbar.
- Class selectors are used frequently
- Both inline-flexboxes and grids were used in positioning


### JavaScript:
- fetch requests are used in the front-end to submit deletion and edit requests for uploads, as well as to fill status information on the gauge.
- Script is used to transform the UTC upload timestamps to the local time of the browser.

### Node.js:
- Express framework was used along with the Pug.js view engine.
- uuid used for generating unique file IDS for being stored.
- express-session used for maintaining user session.
- Mongoose ODM was used for interfacing with MongoDB database.
- Passport used for OAuth2 authentication.
- dotenv used to load environment variables.
- Multer library used for parsing and storing the uploaded files.



## Technical Achievements
- **Self Hosted Service**:
    Instead of hosting the service on Glitch, I'm hosting the application myself on a WPI virtual machine that I have access to for my MQP. One of the noticable benefits in self-hosting is how much faster it is to set up and run. The processing capabilities of the virtual machine are far greater than a Glitch container, and it can run 24/7. A downside to self-hosting is how much additional configuration that's needed. Making quick fixes to files isn't as easy over SSH, and I had to add new nginx and firewall rules to make sure the path was open. Additionally, self-hosting is only as reliable as your internet connection ;)
- **OAuth2 via Google**: I'm planning to use Google signins for another project in the near future, so I thought this would be a good time to learn how to implement OAuth2 with a Google project. It wasn't too hard to set up, and it provides a means to restrict how many counts someone can register to the number of Google accounts they have.
