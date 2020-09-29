## Shopping List

Luke Bodwell

https://lbodwell-shopping-list.herokuapp.com/

My application is an online shopping list. It features a CRUD API with protected routes. Users must authenticate using OAuth2 with GitHub.
Once, logged in, they are redirected to the main page and are allowed to add new items to their shopping list and edit or delete existing ones.
The goal of the application is to provide users with a way to keep track of items they need to buy and their prices. I decided to use Mongoose
to interface with MongoDB and that as well as OAuth gave me a bit of trouble at first. I decided to go with OAuth using the GitHub strategy as I
thought it would be useful to know how to do and I didn't want to have to deal with storing encrypted user passwords myself. I decided to use Bootstrap
for my CSS framework because I like it's grid layout system, think it looks pretty good, and am pretty familiar with it already. I made some
modifications to the CSS like changing the default font, adding various margins and padding, and adjusting the appearance of tables.

I used the following Express middleware packages:
- express.static (for serving static assets)
- express.json (for parsing the raw JSON in HTTP request bodies)
- morgan (for access logging)
- compression (for compressing requests using gzip)
- session (for storing user session id's in cookies and sessions data on the server)
- helmet (for adding security to API by setting various HTTP headers)
- method-override (for overriding methods to accomodate requests from clients that only have access to GET and POST methods)

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I deployed my application to Heroku