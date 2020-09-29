# a3-mattheus-nascimento

link: [a3-mattheus-nascimento.glitch.me](a3-mattheus-nascimento.glitch.me)

A place to keep a secret list of your enemies hidden from prying eyes by a login page. 
With account creation by simply entering a username that has not been used before. 
Some challenges faced while creating the application were figuring out how and where to process certain info.
and when something went wrong at which point I had messed up sending the proper information.

My authentication strategy is a login serviced by my mongodb database. It will check the password against the one stored in memory for the given username.
If the username has not been used before, a new account will be created with the username and password combo and the user is notified of such.

Iused the bootstrap CSS framework. and I liked the look it gave my application so I did not do any custom CSS work.

For express middlewares I used:

Static: 
A built in middleware used for servicing static pages.

Morgan:
prints HTTP requests to the console log for debugging, including code and time taken.

Cookies: uses cookies to uniquely identify sessions, allowing multiple people to be logged in at once.

Body-Parser: parses the content of an HTML response based on the type described in the header.

Timeout: sets a timeout for HTTP requests in my server. set to 120s as this seems to be a safe bet based on online searches.
