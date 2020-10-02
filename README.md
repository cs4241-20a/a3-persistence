Bookshelf
https://a3-brittany-henriques.glitch.me

The goal of my application is a sustain a bookshelf which keeps track of the title, length, and average time it would take to read the book.
Some challenges I faced while working on this application was the sustainability of the data and learning to work with MongoDB. When it
came to the log ins, I was especially challenge, so I decided to take an easier route. I created two collections, one for books one for
logins, and searched through the log in collection for both matching usernames and passwords, and if they didn't not show I sent a message
to the user. If they did show, I stored the username to help with finding and storing the book data. I used Milligram as my CSS framework because
I like the simplicity of working with the CSS and how it appears on the page. I made some small modifications to the default colorings of the
base components in the Milligram CSS to achieve the "book like" theme I had wanted. The five middlware packages that I used were:

body-parser: parses incoming requests before they are handedled so that all the data is readable
cookie-parser: parses the cookie header and populates req.cookie based off of the data
response-time: prints out the response time of requests, from when they are made, to when the headers are printed
morgan: also prints out the response time of requests being made
timeout: times out a request after a set amount of time has elapsed and stops the flow if one should time out
