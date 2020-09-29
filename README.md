Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Developer Ice Cream

Ann Jicha https://a3-ahjicha.herokuapp.com/

My application provides a way for developers to order ice cream using their github account. This is a half-joking concept semi-inspired by ACM bakesales and the power of sugared snacks while programming.
My main challenge creating this application was authentication. I eventually settled on github authentication because it seemed the most 
straightforward to implement. 
My CSS framework is milligram, both because its minimal aesthetic fit my application (as it is aimed at developers ordering ice cream efficiently)and because of ease of use.
My five middleware packages are
- body-parser, which parses incoming request bodies
- serve-favicon, which serves the small icon displayed on the tab when the website is open (the favicon)
- passport, which allows for authentication and passport-github, which allows for the github authentication strategy with passport
- morgan, which logs http requests and was useful in the development stages
- compression, which compresses responses

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy.

- **Tech Achievement 2**: I used heroku to deploy my application. This was a good choice for me because heroku allows for continious integration with github seamlessly, and allowed for my github authentication (unlike glitch).

