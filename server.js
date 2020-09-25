// const { response } = require( 'express' )
const bodyParser = require( 'body-parser' )
const express = require( 'express' )
const app = express()

app.use( function( req, res, next ) {
    console.log( "Incoming request for " + req.url )
    next()
} )
app.use( express.static( "public" ) );

// app.use( bodyParser.json() )

app.get( "/", ( request, response ) => {
    response.sendFile(__dirname + "/views/index.html" );
} );

app.get( "/appdata", ( request, response ) => {
    response.json( appdata )
})

app.post( "/submit", bodyParser.json(), ( request, response ) => {
    console.log(request.body )
    appdata.push( request.body )
    console.log( appdata )
    response.json( appdata )
})

app.post( "/update", bodyParser.json(), ( request, response ) => {
    console.log(request.body )
    dataIterator( request, true, false )

})

app.post( "/delete", bodyParser.json(), (request, response ) => {
    console.log( request.body )
    dataIterator( request, false, true )
    response.json( appdata )
    
})

const dataIterator = function( incomingData, isUpdate, isDelete ) {
    for( var i = 0; i < appdata.length; i++ ){
        // console.log( "Listing ID: " + appdata[i].id + " Delete ID: " + request.body.id )
        if( appdata[i].id === parseInt( incomingData.body.id ) ){
            if( isDelete === true ){
               appdata.splice( i, 1 )
               console.log( "Removed Listing with ID: " + incomingData.body.id )
            }
            else
            {
                appdata[i] = incomingData.body
                console.log( "Updated Listing with ID: " + incomingData.body.id )
            }
            break
        }
    }
}


// default data
const appdata = [
    { firstname: "Joe", lastname: "Bonchon", cameramake: "Canon", cameramodel: "A-1", cameraformat: "35mm", price: 150, condition: 76, bargain: false, delete: false, id: 1 },
    { firstname: "Pongo", lastname: "Pwaga", cameramake: "Nikon", cameramodel: "FTn", cameraformat: "35mm", price: 95, condition: 90, bargain: true, delete: false, id: 2 },
    { firstname: "Toe", lastname: "Progle", cameramake: "Yashica", cameramodel: "Mat124G", cameraformat: "6x6", price: 50, condition: 100, bargain: true, delete: false, id: 3 }
  ]

app.listen(3000)