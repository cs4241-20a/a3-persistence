# Assignment 3 - Persistence

https://a3-sgehly.herokuapp.com/

## Ticket Mania - Secure Edition

Ticket Mania - Secure Edition is an all-in-one ticket solution that improves on the security of its predecessor. TMSE is a single-page app that includes all the CRUD operations you could ever want, including creating new tickets, editing tickets inline, and deleting them without ever accomplishing anything, kind of like normal support tickets - the realism is insane.

## Requirements

- ✅ a Server, created using Express (no alternatives will be accepted for this assignment)
- ✅ a Results functionality which shows the entire dataset residing in the server's memory
- ✅ a Form/Entry functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.

- ✅ Use of at least five Express middleware packages. Explore!

  - express.json() - replacement for body-parser
  - session - express-session
  - PassportJS - includes Github & local strategies
  - compression - response compression
  - morgan - http request loger

- ✅ Persistent data storage in between server sessions using mongodb
- ✅ Use of a CSS framework or template. This should do the bulk of your styling/CSS for you and be appropriate to your application. For example, don't use NES.css (which is awesome!) unless you're creating a game or some type of retro 80s site.

- ✅ HTML input tags and form fields of various flavors (<textarea>, <input>, checkboxes, radio buttons etc.)

  - Uses textareas and inputs.

- ✅ HTML that can display all data for a particular authenticated user.

- ✅ CSS styling should primarily be provided by your chosen template/framework.

- ✅ At minimum, a small amount of front-end JavaScript to get / fetch data from the server. See the previous assignment for reference.

- ✅ A server using Express, at least five pieces of Express middleware, and a persistent database (mongodb).

## Technical Achievements

- ✅ Implement OAuth authentication, perhaps with a library like passport.js.

  - Github supported

- ✅ Instead of Glitch, host your site on a different service like Heroku or Digital Ocean. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
  - I chose Heroku as the cold boot times are a lot better than Glitch, I like the UIX of Heroku, more, it has an automatic import from GitHub on every push, and because I wanted the points. Glitch is more suited for playground stuff IMO, it's a pain to mirror a dev environment.
