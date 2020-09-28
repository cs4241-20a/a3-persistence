Assignment 3 - User Tech Review w/ Data Persistence
===

Jonathan Dang: https://a3-jonathan-dang.herokuapp.com/

***User Tech Review*** is a website that allows users to assign their own ratings to either phones, tablets, or laptops. There are a total of 4 ratings in total; price, battery life, performance, and device feel. Each of these ratings are out of 5 stars and by submitting the ratings, the website would derive the overall rating of the user. This overall rating would be presented in a table that consists of all the other collected data that are residing in the server. In addition to adding a review, the user would also be able to modify and delete any reviews that are seen in the table.

In this project, I was able to make the data be persistent by leveraging MongoDB. By utilzing this DB, users will now be able to retain all the data that was collected during each users session. While going through this project, I did encounter quite a few challenges, but I think that was due to me still not having a lot of experience with working with a webserver. One particular area I found challenging was being able to remember which User had logined in after being redirected to the reviews.html file. This took me quite some time to figure out, and fortunately I was able to find my solution by utilizing the cookieSession middleware. By leveraging this middleware, I was able to retain information about the user login by storing it in a request's session. After discovering this solution, the rest of the project felt a little easier to do. Of course I still ran into some issues, but they were not too bad to overcome.

For authenticating the user, I decided to use the LocalStrategy for it. My main reason for choosing this was because I was able to find a good documentation for it and felt it was easier for me to implement. For selecting my CSS framework, I decided to use the Bulma CSS Framework. I particularly liked the styling options that was offered with this framework and the documentation was straightforward to follow. Based on my previous design of my webpage, I believe I could easily replicate the design with Bulma, which is why I ended up using this as my choice of CSS Framework. I didn't particularly include any modifications to the framework either.

While implementing my server, I utilized 5 Express middleware packages. I used body-parser, helmet, favicon, cookieSession, and serve-static. Body-parser helped me be able to parse the body of any of the requests sent to the server from the client and it would convert it to a json object, thus making it easier for me to work with. Helmet provided some security measures to webpage by setting various HTTP headers so the actual one that is important would be harder to spoof. Favicon helped make it an easy process for adding an icon to my webpage. Cookie Session was able to create cookie-based sessions, which I utilized to help me retain information from the login screen to the reviews screen. Serve-Static allowed all the necessary files from within the given root directory to be served. 


# Concepts that Application Demonstrates

## HTML
- Primarily used the input and select tags.
- Only shows the data from the particular authenticated user.

## CSS
- Made use of Bulma to handle the majority of my styling for the webpage.

## JavaScript
- Added some JavaScript code to get/fetch data from the server and manage the data from the server.

## Node.js
- Made server using Express.
- Incoporated 5 pieces of Express Middleware
  - body-parser: for parsing the body of any requests sent to the server and converts it to a json object
  - helmet: helps secure my webpage by setting various HTTP headers 
  - favicon: adds an icon to my webpage in a simple manner
  - cookieSession: creates cookie-based sessions to help retain information from the login screen to the reviews screen
  - serve-static: allows all the necessary files from within the given root directory to be served 


# Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the Github Strategy to allow users to sign in through their github account. Please note, that this will only work when using the website on Heroku. The Github Callback URL was designed for Heroku only. This was a little challenging because I found the documentation a little difficult to follow, but by continuing to do research on this, I was able to figure it out. 

- **Tech Achievement 2**: I used Heroku to host my site rather than using Glitch. By using Heroku I found it easier to work with because it was automatically deployed from git so I did not have to keep updating the project like in Glitch. The process of setting it up was fairly straightforward and I did not find many challenges when doing this.

# Design Achievements

- **Bulma CSS Framework**: Used the Bulma CSS Framework to help me style a large part of my website. I thought this CSS Framework would add a nice style to my webpage and would be something that would fit in really well based on my previous design.

