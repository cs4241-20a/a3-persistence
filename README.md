## Simple To-Do Page

[https://a3-brad-cosma.glitch.me/](https://a3-brad-cosma.glitch.me/)

This page provides a very simple to-do list. It aims to give users each their own list, bound to account, that they can submit 
to and edit/delete entries in. The application has separate pages for logging in and registration, with the main page detecting
login status based on cookies and directing the user to log in if they are not already logged in. I chose to use a simple username
and password system for authentication because it was easiest. 

I am storing passwords in plaintext, which is always a bad idea, 
but it really shouldn't matter for a simple project like this. In a real production environment I would take proper security
measures. The databse structure is very simple, each user has their own doccument with their username, plaintext password,
and an array of their entries to the to do list. I decided to use an array to store all the entries because it would be easy
to loop through and filter for the desired entry (just using the indexof function is sufficient to tell me the location I need to edit).
The challenges I had mostly involved the login system and navigating between pages based on it. Redirecting from login
to the main page proved challenging, I tried multiple methods and ended up on one that feels janky but seems like the best way to
do it. Once I learned how to query the database and convert my results to an array, it was trivial to add, edit, and delete entries.

I used Pure as my css template, as it was very easy to use and is minimally obtrusive. I wanted to go for a very basic look, and Pure
allows me to do that. Pure can be found here: [https://purecss.io/](https://a3-brad-cosma.glitch.me/)

I made some simple styling choices that are different from the base css file Glitch provides us (does that count as a template? clearly
not for the purposes of grading this project but just in concept.) Mainly, I added some custom borders, backgrounds, and margins to make
the content be alligned nicely. I also alligned the edit/delete buttons to the right of the page, to be have them vertically alligned 
with eachother.

The five express middleware packages I used were:
- `body-parser` to allow me to easily process the json contained in sent messages
- `express-slash` to make sure trailing slashes in URLs don't matter, making both coding and using the site much easier.
- `serve-favicon` to provide the nice little checkmark that sits in the left of the tab, making the site feel more complete.
- `morgan` to log all accesses to the site, greatly reducing the number of different printouts I had to sprinkle in.
- `cookie-session` allows me to store the current user's username as a way of seeing whose doccuments need to be accessed. This, although janky, was the best way I could make it work.

`path` is also used to provide general utility, but it's not as cool.