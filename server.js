var express = require('express');
var app = express();
port = 3000;

app.use(express.static("public"));


app.listen(process.env.PORT || port, function () {
  console.log('Example app listening on port', process.env.PORT || port);
});