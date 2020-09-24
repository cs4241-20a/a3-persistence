const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      express = require( 'express' ),
      app = express(),
      bodyparser = require( 'body-parser' ),
      port = 3000

      //          json = { vehiclemake: makeinput.value , vehiclemodel: modelinput.value , vehicleyear: yearinput.value , vehicleage: (new Date().getFullYear() - yearinput.value)}

const appdata = []

app.use( express.static( 'public' ) )


app.get( '/', (request, response) => response.sendFile( __dirname + '/views/index.html' ) )

app.get( '/appdata', bodyparser.json(), (request, response) => {
  response.json(appdata)
})

app.post( '/submit', bodyparser.json(), (request, response) => {
  //console.log(request.body)
  appdata.push( request.body );

  response.json( request.body );
})

app.listen( process.env.PORT || port )
