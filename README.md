
## Shared Bar Database
Ryan Birchfield

https://rhbirchfield-a3-persistance.herokuapp.com/

My application allows for a shared database to be locked behind an admin login. I used baseline authentication because it seemed like easiest to just check against a table.
I used the water.css framework as I really liked the look of the forms and the color scheme.
The five express middleware packages:
morgan: logs requests to the server
static: loads all of the public pages
timeout: times out requests if not answered.
body-parser: allows for easy json parsing
compression: compresses data sent back and forth.


### Design/Evaluation Achievements
- I hosted my application on heroku. I found it to be much harder to work with than glitch, though that is likely because I did all of my development on glitch as well, so I did not see a reason to swap hosts.

