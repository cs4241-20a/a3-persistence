const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime          = require( 'mime' ),
      express       = require('express'),
      app           = express(),
      responseTime  = require('response-time'),
      dir           = 'public/',
      port          = 3000

// create "middleware"
var _responseTime = responseTime()

//make express server

//logging requests
app.use(function(req,res,next){
  //console.log(req.url);
  next()
})
app.get('/', function(req, res){
  console.log('recived GET')
  handleGet( req, res )
})
app.post('/', function(req,res){
  console.log('recived POSt')
  handlePost( req, res )
})
app.use(express.static('public'))
app.listen(port);

//data base, local.
const appdata = [
  { task : 'dishes', DueDate :1, Priority: 1 },
]

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    incomingData = JSON.parse( dataString )

    const TASK = incomingData.Task
    const daysTillDue = incomingData.DaysTillDue
    const day = incomingData.curDate

    //get the date that the task is due
    var dueDate = parseInt(day,10) + (parseInt(daysTillDue, 10) * 86400000)

    //calculate the priority
    var PRIORITY = dueDate - new Date().getTime()
    var task = JSON.stringify({ Task: TASK, DaysTillDue: daysTillDue, Priority: PRIORITY })

    //adds the current task to the server database
    appdata.push(task)

    //sends the response
    if(isNaN(dueDate)){
      console.log("Days Till Due was not a number")
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      let body = JSON.stringify({ dataBase: 'Bad Input'})
      response.end( body )
    }else{
      console.log("Sent Data Base")
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end( task )
    }
    
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

