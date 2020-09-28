// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const body_parser = require("body-parser");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

//add the data to the database
app.post('/add', body_parser.json(), (request,response) => {
  // the request gets added to the database
  console.log('Adding to the database: ' + request.body.dream)
  dreams.push(JSON.stringify(request.body.dream))
  response.json(request.body)
})

// remove data from the database
app.delete('/delete', body_parser.json(), (request,response) => {
  // the request gets reomoved from the database
  console.log('Removing from the database')
})

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
