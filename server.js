const MSG_ERR_NAME_BLANK = "Error: the Name field must not be empty."
      MSG_ERR_FIELD_MISMATCH = "Error: invalid input.  Score & Value fields must either be both empty or both filled."
      MSG_ERR_NON_NUMERIC = "Error: the Score and Value fields must only contain numbers."
      MSG_ERR_NO_ASSIGNMENT = "Error: no assignment with this name exists.  To create one, fill in the Score and Value fields."
      MSG_SUC_ASSIGN_ADD = "Successfully added a new assignment."
      MSG_SUC_ASSIGN_EDIT = "Successfully edited assignment."
      MSG_SUC_ASSIGN_REMOVE = "Successfully removed assignment."
      ACTION_NONE = "none"
      ACTION_EDIT = "edit"
      ACTION_NEW = "new"


const express         = require('express'),
      app             = express(),
      bodyparser      = require('body-parser'),
      favicon         = require('serve-favicon')
      path            = require('path')
      helmet          = require("helmet")
      debug           = require('express-debug')
      lowercasePaths  = require("express-lowercase-paths")
      GitHubStrategy  = require('passport-github').Strategy;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static( 'public' ))
app.use(bodyparser.json())
app.use(helmet());
app.use(lowercasePaths())

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.post( '/submit', function( request, response ) {
  let jsonResponse = {}
  console.log(request.body)
  handleInput( jsonResponse, request.body )
  
  jsonResponse.grades = grades
  jsonResponse.total = getTotalPercent()

  response.writeHead( 200, {'Content-Type': 'application/json'})
  response.end( JSON.stringify( jsonResponse ) )
})




let grades = []
function getTotalPercent() {
  let pointsAchieved = 0
  let pointsPossible = 0
  
  for(let i = 0; i<grades.length; i++) {
    pointsAchieved += grades[i].assignScore
    pointsPossible += grades[i].assignPossible
  }
  
  return Math.round(pointsAchieved / pointsPossible * 10000 ) / 100
}

function getAssignPercent(score, possible) {
  return Math.round( score / possible * 10000 ) / 100
}


function handleInput(reply, input) {
  
  const assignName = input.inputName
  if(assignName === "") {
    reply.message = MSG_ERR_NAME_BLANK
    reply.action = ACTION_NONE
    return
  }
  if( (input.inputScore === "") !== (input.inputPossible === "") ) {
    // ensure score & possible are either both full or both blank
    reply.message = MSG_ERR_FIELD_MISMATCH
    reply.action = ACTION_NONE
    return
  }
  const assignScore = Number(input.inputScore)
  const assignPossible = Number(input.inputPossible)
  if( Number.isNaN(assignScore) || Number.isNaN(assignPossible) ) {
    // ensure numeric fields are actually numeric
    reply.message = MSG_ERR_NON_NUMERIC
    reply.action = ACTION_NONE
    return
  }
  
  for (let i = 0; i<grades.length; i++) {
    if( grades[i].assignName === assignName ) {
      if( input.inputScore === "") {
        // delete item
        grades.splice(i)
        reply.message = MSG_SUC_ASSIGN_REMOVE
        reply.action = ACTION_DELETE
        return
        
      } else {
        // edit item  
        grades[i].assignScore = assignScore
        grades[i].assignPossible = assignPossible
        grades[i].percent = getAssignPercent( assignScore, assignPossible )
        reply.message = MSG_SUC_ASSIGN_EDIT
        reply.action = ACTION_EDIT
        return
      }
    }
  }
  // if no match, create new assign
  if( input.inputScore === "") {
    // but first check that fields are filled in
    reply.message = MSG_ERR_NO_ASSIGNMENT
    reply.action = ACTION_NONE
    return
  }
  
  let assignment = { assignName: assignName, assignScore: assignScore, assignPossible: assignPossible }
  assignment.percent = getAssignPercent( assignScore, assignPossible )
  grades.push( assignment )
  
  reply.message = MSG_SUC_ASSIGN_ADD
  reply.action = ACTION_NEW
  return
}



debug(app, {})
app.listen( process.env.PORT )