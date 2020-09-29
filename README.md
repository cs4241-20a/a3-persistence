## Note ##

your glitch (or alternative server) link e.g. http://a3-christian-tweed.glitch.me

Note was a unique application aimed at creating a practice tool for myself. It can be difficult remembering what tempo I'm at with certain songs, so I figured I'd implement something that kept track of the tempo as well as provide a playback for me. The playback was a really cool idea, but also extremely difficult to execute because abcjs is a really odd library. I wanted to use ToneJS, but Tone did not provide any way to read musicXML (a widely supported music document representation). So what I thought I'd do is store the abc string on the db since it's small, and use it to generate the display for the sheet music. Displaying and playing the sheet music does work, but only with abcjs. In order to hook up ToneJS to this project I was trying to convert the abc string into a midi file, but the encoding from abcjs threw ToneJS off and I couldn't get that to work.

My other big challenge was with the documentation of passport. I provided custom callbacks for my authentication route, because I thought it was the straightforward way to implement it. This ended up causing PassportJs to not actually call req.login() which is necessary for serializing and deserializing users. I had to dig into deep stack overflow to find this and I lost hours to the authentication setup. 

I used LocalStrategy because I wanted to keep everything related to MongoDB since that is a good industry skill to have.

I used Materialize CSS. It's an odd CSS framework as it has a lot of really strong features and it didn't require any install. I appreciate a lot that it does, but I was not able to get the flow with it because I am just not used to it yet. It also didn't have the best documentation for accessible examples, so forgive my occaisonal div. One thing I added to a base.css file was a  `pageHeader` class that I used to layout the main header for every page.

Express Middleware
1. Passport: Passport is a middleware designed to handle authentication for a web app
2. Body-Parser: Body-Parser takes the request body and turns it into an object and appends it to the request
3. Serve-Static: Serve-Static is a middleware designed to handle file serving in the application
4. Serve-Favicon: Serve-Favicon is a middleware that provides the standard favicon.ico to the browser
5. Session: Session is a client-server session management system that stores the session on the server
6. Multer: Multer is a middleware designed to take form data that has multiple types in it (including files) and provide them to the req object


`Technical Achievements`: I used 6 middleware instead of 5. I worked with an incredibly obtuse JS framework to implement web audio and playback. I used an external python script to translate the musicXML into abc strings, and ran it as a forked process. 
- the five Express middleware packages you used and a short (one sentence) summary of what each one does

