## Sample WebStore
https://a3-edward-carlson.glitch.me/ 

A sample web store application allowing users to drag and drop items into their cart
Can sign in with github OAuth
Can change password
Data is saved onto server

It was hard finding express middleware

I used github OAuth and a custom login, I chose github as everyone had a github account.
I used bulma because I had heard of it before but never used
I used a custom css to set the headerbar in the store page as well as let you drag into an empty column

Express middleware used:
- slash, allows site to handle trailing / in urls
- serve-favicon lets me serve a favicon for tab, bookmark, and phone icons
- cookie-session lets me keep track of current user
- body-parser lets me more easily parse JSOn that is sent to the server
- passport allows me to use github OAuth

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy