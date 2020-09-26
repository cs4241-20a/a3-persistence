## simcar 2

https://a3-rmanky.herokuapp.com/

**simcar 2** is the remake that nobody asked for! Now instead of punching in 
car setups, players will have to prove themselves by *actually* driving 
their own Formula 1 car around a race track!

The biggest challenge for this project was definitely uniting the physics engine and the 3D engine, as they are not automatically binded.
For example, a 3D cube with collisions requires the creation of a `CANNON.Box` and `THREE.BoxGeometry`, with the latter copying the position and rotation
of the prior at every frame. Four wheels and a car body wasn't too much to handle, but it wasn't very intuitive at first.

I chose to use passport.js and GitHub, largely because it was suggested. The callback stuff was very confusing in the beginning, but looking back I'm not sure why.

Baseline Requirements
---

Your application is required to implement the following functionalities:

- ✔️ a `Server`, created using Express (no alternatives will be accepted for this assignment)
- ✔️ a `Results` functionality which shows the entire dataset residing in the server's memory
- ✔️ a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- ✔️ Use of at least five [Express middleware packages](https://expressjs.com/en/resources/middleware.html). Explore! 
    - body-parser (An alternative JSON parser that is used for all data going in and out of the server)
    - compression (I serve quite large 3D models and textures, so this helps shrink file sizes being sent over the internet)
    - cookie-session (It was annoying having to login every time, cookies mean that logins are remembered)
    - serve-favicon (Had a favicon before, but thought I'd through this in why not)
    - [passport.js](http://www.passportjs.org/) (Needed for GitHub OAuth)
- ✔️ Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- ✔️ Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.
    - [Bulma](https://bulma.io/) was carried over from Assignment 2, as I found it easy to use and filled with helper classes.

Achievements
---

*Technical*
- ✔️ (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authentication or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- ✔️ (5 points) Instead of Glitch, host your site on a different service like Heroku or Digital Ocean. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
    - I decided to use Heroku because I've seen other projects/samples use it before. It was pretty straightforward to setup and has automatic GitHub syncing, which 
    instantly makes it 100x better than glitch. Also, Heroku seems to wake up apps quicker than Glitch (which is a plus).
- 🏎️ Build an entire racing game with [ThreeJS](https://threejs.org/) and [CannonJS](https://schteppe.github.io/cannon.js/)
    - I am a little worried that performance might be sub-optimal on some computers,
    so I have recorded a short demo of me completing 2 laps (along with editing and deleting): https://www.youtube.com/watch?v=oUMfqU0IXHE
    - The controls are:
        - W / Up Arrow = Forward
        - A / Left Arrow = Left
        - S / Down Arrow = Reverse/Brake
        - D / Right Arrow = Right

*Some Notes*
- Every user can see all other users results, but to prove I can filter the results by user I have made the text **bold**
for the results of the user that is logged in.
- Also, the user only has the ability to modify or invalidate their own results.
- The users are stored in the MongoDB database in a separate collection, but this isn't really used anywhere (just for me to track logins).
- I don't really have `"HTML input tags and form fields of various flavors (<textarea>, <input>, checkboxes, radio buttons etc.)"`, but I couldn't
    find anywhere to insert these that would make sense.
