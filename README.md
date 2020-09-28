Madeline Perry
Webware A3
https://a3-madelineperry.glitch.me/

**Grocery Manager**

This application is created to be a simple way to manage a grocery list. A user must register and log in to the site to use it. The user can then add and delete items from the list, and each item is stored in a database hosted by MongoDB.

The most difficult part of this assignment for me was trying to manage how to update items in the database. This functionality is still not implemented, but the code that I wrote for it so far can be found in my scripts.js file. I tried to write something where if the user submits an item with the same name as an item already in the database, that item would just update instead of creating a new item.

I chose to do a simple register/login system for the page using a database on mongoDB to store the information. I encrypted the user passwords using bcrypt and passport for authentication. I used passport because there were a lot of resources available for it and it seemed like the most simple option.

For CSS frameworks I started with Bootstrap but found the amount of information about it to be daunting. I didn't have a lot of time to devote to learning it, so I chose to use Bulma instead which was similar but a little easier for me to wrap my head around. Bulma was also more forgiving with adding my own styling in addition to its predefined classes.

The middleware packages I used were:

-Passport (for user authentication)

-BodyParser (for parsing the requests into easier to use json)

-Session(to store some data during a user's session)

-Static (to make sure all files in 'public' are available)

-Flash (to display error messages during registration/login)

