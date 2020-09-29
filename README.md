Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===


## Developer Ice Cream

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does

My application provides a way for developers to order ice cream using their github account. This is a half-joking concept semi-inspired by ACM bakesales.
My main challenge creating this application was authentication. I eventually settled on github authentication because it seemed the most 
straightforward to implement. 
My CSS framework is milligram, both because its minimal aesthetic fit my application and because of ease of use.
My five middleware packages are
- body-parser, which parses incoming request bodies
- serve-favicon, which serves the small icon displayed on the tab when the website is open (the favicon)
- passport, which allows for authentication
- passport-github, which allows for the github authentication strategy with passport

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

- **Tech Achievement 1**: I used heroku to deploy my application. This was a good choice for me because heroku allows for continious integration with github seamlessly, and allowed for my github authentication (unlike glitch).

