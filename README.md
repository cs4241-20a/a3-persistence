## simcar 2

https://a3-rmanky.herokuapp.com/

**simcar 2** is the remake that nobody asked for! Now instead of punching in 
random tires, players will have to prove themselves by *actually* driving 
their own Formula 1 car around a race track!

Baseline Requirements
---

Your application is required to implement the following functionalities:

- ✔️ a `Server`, created using Express (no alternatives will be accepted for this assignment)
- ✔️ a `Results` functionality which shows the entire dataset residing in the server's memory
- ✔️ a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- ✔️ Use of at least five [Express middleware packages](https://expressjs.com/en/resources/middleware.html). Explore! 
    - body-parser
    - compression
    - cookie-session
    - serve-favicon
    - [passport.js](http://www.passportjs.org/)
- ✔️ Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- ✔️ Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.
    - [Bulma](https://bulma.io/) was carried over from Assignment 2

Achievements
---

*Technical*
- ✔️ (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). *You must either use Github authentication or provide a username/password to access a dummy account*. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this.
- ✔️ (5 points) Instead of Glitch, host your site on a different service like Heroku or Digital Ocean. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
    - I decided to use Heroku because I've seen other projects/samples use it before. It was pretty straightforward to setup and has automatic GitHub syncing, which 
    instantly makes it 100x better than glitch. Also, Heroku seems to wake up apps quicker than Glitch (which is a plus).
- 🏎️ Build an entire racing game with [ThreeJS](https://threejs.org/) and [CannonJS](https://schteppe.github.io/cannon.js/)
    - I am a little worried that performance might be sub-optimal on some computers,
    so I have recorded a short demo of me completing 2 laps: 
    - The controls are:
        - W / Up Arrow = Forward
        - A / Left Arrow = Left
        - S / Down Arrow = Reverse/Brake
        - D / Right Arrow = Right
