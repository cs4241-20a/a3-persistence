const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// our default array of dreams
let scoreboard = [
  { name: "Mr. Insano", cps: 105.1, clicks: 1051, seconds: 10, time: 7987989869 },
  { name: "Matthew", cps: 5.4, clicks: 54, seconds: 10, time: 7987097986986 }
];

// checks for objects in the public folder
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
