const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();

const tasks = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of tasks to the webpage
app.get("/tasks", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(tasks);
});

// bodyParser will be called in between the request and the response
app.post("/add", bodyParser.json(), (request, response) => {
  tasks.push( request.body.tasks )
  response.json( request.body )
})

process.env.PORT = 3000;
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
