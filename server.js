const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const responseTime = require('response-time')
const morgan = require('morgan')
const path = require('path')
const favicon = require('serve-favicon')
const passport = require('passport')
const GitHubStrategy = require("passport-github").Strategy;
const mime = require('mime')
const connectrid = require('connect-rid')

require('custom-env').env('development')

const mongodb = require('mongodb')
const { SSL_OP_EPHEMERAL_RSA } = require("constants")
const uri = `mongodb+srv://rfdolan:${process.env.MONGOPASSWORD}@cluster0.jpq6i.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient( uri, {useNewUrlParser: true, useUnifiedTopology: true})

let collection = null
let currentUser = ""
let isGithubUser = false

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'webware' ).collection( 'creatures' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then(/* console.log */)

// Automatically deliver all files in the public folder
app.use( express.static('public/images'))
app.use( express.static('public/js'))
app.use( express.static('public/css'))

// get json when appropriate
app.use( bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));

app.use( responseTime())

app.use(morgan('combined'))

app.use(connectrid({
    headerName: 'X-RID'
}))

app.use(favicon(path.join(__dirname, 'public','favicon.ico')))

app.use( (req, res, next) => {
    if( collection !== null) {
        next()
    } else {
        res.status( 503 ).send()
    }
})

// Get request for login / starting screen
app.get('/', (req, res) => {
    if(currentUser !== "") {
        console.log("user:",currentUser)
        res.sendFile(path.join(__dirname,'public/index.html'));
    } else {
        res.sendFile(path.join(__dirname,'public/login.html'))
    }
});

// If the user is not logged in, send a 403 and lock them out of accessing the page
app.get('/index.html', function (req, res){
  if(currentUser === ""){
    res.sendStatus(403)
  }
  else {
    res.sendFile(path.join(__dirname,'public/index.html'))
  }
})

// Get request to check if a user is logged in
// send a 500 if not so that the user is sent back to the login screen
app.get('/loggedIn', function (req, res){
  if(currentUser == ""){
    res.sendStatus(500)
  }
  else{
    res.sendStatus(200)
  }
})

// Get everything
app.get( '/appData', (req, res) =>{
    // get stuff from db
    if(collection !== null ) {
        getAll().then(result => (res.json(result)))
    }
})

app.post( '/add',  async function( req, res ) {
    let postedData = req.body

    postedData.userName = currentUser

    postedData.num = parseInt(postedData.num)
    postedData.ac = parseInt(postedData.ac)
    postedData.hp = parseInt(postedData.hp)

    const currCreatures = await collection.find({userName: currentUser}).toArray()
    let orderNum= determineOrder(currCreatures, postedData)

    postedData.order = orderNum;

    editAllHigher(currCreatures, orderNum)

    await collection.insertOne(postedData )
    const allCreatures = await getAll()
    console.log(allCreatures)
    res.json(allCreatures)
    return res.end()
  })

  async function getAll() {
    const allCreatures = await collection.find({userName: currentUser}).toArray()
    return allCreatures.sort(compare)
  }



app.post( '/remove', async function(req, res)  {
    await collection.deleteOne({ _id: mongodb.ObjectID( req.body._id ) })
    await closeGap(req.body.order)

    await getAll().then(result => res.json(result))

})

async function closeGap(orderNum) {
    const currCreatures = await getAll()
    currCreatures.forEach((creature) =>{
        if(creature.order >= orderNum) {
            collection.updateOne(
                { _id: mongodb.ObjectID( creature._id)},
                { $set:{ order:creature.order-1}}
        )
        }
    })
}

app.post( '/move', async function(req, res) {
    let postedData = req.body
    let target = await collection.find({userName: currentUser, _id: mongodb.ObjectID( postedData.id)}).toArray()
    let other = await collection.find({userName:currentUser, order:parseInt(postedData.order)+postedData.movedir}).toArray()

    target = target[0]
    other=other[0]
    if(other !== undefined && target !== undefined){
        console.log("NOT NULL")
        if(target.num === other.num) {
            console.log("SAME INIT")
            await collection.updateOne(
                { _id: mongodb.ObjectID(postedData.id)},
                { $set:{order: other.order}}
            )
            await collection.updateOne(
                { _id:  other._id},
                { $set:{order: target.order}}
            )
        }
    }

    await getAll().then(result => res.json(result))

})

app.post( '/login',  async function(req, res)  {
    if(currentUser !== "") {
        res.sendStatus(200)
        return res.end()
    }
    let userData = req.body
    let userName = userData.userName
    let password = userData.password

    usercollection = await client.db('webware').collection('users')
    const user = await usercollection.find({userName}).toArray()
    // User does not exist, create them
    if(user.length === 0) {
        await usercollection.insertOne(userData)
        currentUser = userName
        res.sendStatus(200)
    // User exists, check password
    } else {
        if(user[0].password === password) {
            currentUser = userName
            res.sendStatus(200)
        } else {
            currentUser = ""
            res.sendStatus(500)
        }
    }
})

function determineOrder (currCreatures, toAdd) {
    let currPlacement = 0;
    currCreatures.forEach((creature) => {
        /*
        console.log("creature:",creature)
        console.log("toAdd:",toAdd)
        if(parseInt(creature.num) < parseInt(toAdd.num))
            console.log('reality is strange')
            */
        if(parseInt(creature.num) < parseInt(toAdd.num) && parseInt(creature.order) >= parseInt(currPlacement)) {
            currPlacement = creature.order + 1
        }
    })
    return currPlacement
}

async function editAllHigher(currCreatures, orderNum) {
    currCreatures.forEach((creature) =>{
        if(creature.order >= orderNum) {
            collection.updateOne(
                { _id: mongodb.ObjectID( creature._id)},
                { $set:{ order:creature.order+1}}
        )
        }
    })

}

// Helper to sort array of creatures
function compare(a,b) {
    if(a.order > b.order) return 1;
    if(b.order > a.order) return -1;

    return 0;
}




const listener = app.listen( process.env.PORT, ()=> {
  console.log( 'Your app is listening on port ' + listener.address().port )
})