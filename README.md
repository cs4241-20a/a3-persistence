https://a3-cvkittler.herokuapp.com/

# Dream Manager

The goal of dream manager is to be a high level todo list for your life. 
It was  challanging getting the application to work with a database, mainly because this was my first experiace with express so i had to learn two things at the same time. I used **water.css** for my framework because it has a plesent dark themed astetic that i like. I chose to use gitHub's Oauth because it was easy to implament and im on a time crunch. i used the following middle ware;
body_parser, connect-timeout, response time, morgan, and staic.
**body parser** was used to parse incoming JSON objects from get post and delete request.
**connection timeout** was used to send a blank JSON object back if the server was taking more than 5 seconds to respond
**response time** was used on the server to see how long each task took
**morgan** was used with response time to report to the concel what requests were coming into the server
**static** was used to serve the static files to the client.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I hosted the server on Heroku