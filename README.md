Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Package Delivery Service

Glitch link: http://a3-lindberg-simpson-2.glitch.me

This project is a page that would allow clients to send packages through a courier. 
To use this project, input the description of the package, the weight of the package in pounds and the deadline (in number of days) for the package to reach the destination.
The cost of delivery is then calculated and displayed in the results table.

### Baseline Requirements

This application implements the following functionalities:

* A Server, created using Express
* A Results functionality which shows the entire dataset residing in the server's memory
* A Form/Entry functionality which allows users to add, modify, and delete data items associated with their GitHub user ID's.
* Persistent data storage in between server sessions using mongodb

* Middleware packages used: 
  * Cookie-session - Establishes cookie-based sessions
  * Morgan - HTTP request logger
  * Body-parser - Parsees HTTP request body
  * Compression - Compresses HTTP responses
  * Response Time - Records HTTP Response Time
* CSS framework or template: Water CSS because it is small, classless and sleek. I also thought the dark mode option was easier on the eyes.
  * I made some changes to the CSS framework so I could create my own grid-container for better positioning of the elements
  * I also made some changes to the way images are displayed on the login page vs home page
* Various HTML tags like forms, inputs, buttons and images

## Deliverables

### Technical Achievements

* Implemented login using Github authenticaion

### Design Achievements

* I followed the following tips from the W3C Web Accessibility Initiative:
  * Writing
    * Provide informative, unique page titles
    * Write meaningful text alternatives for images
    * Use headings to convey meaning and structure
    * Keep content clear and concise
    * Provide clear instructions
  * Designing  
    * Provide sufficient contrast between foreground and background
    * Don't use color to convey information
    * Associate a label with every form control
    * Include alternative text for images
  * Developing
    * Associate a label with every form control
    * Include alternative text for images
    * Reflect the reading order in the code order
