const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
//add environment variable for password and use that instead.
//access via   `${process.env.DBPASSWORD}`
//can look at teams chat (according to Charlie) for ways to do this locally (the .env file)
const uri = "mongodb+srv://admin:x7s7RxRLzQYjXPLhfrk34U3a@cluster0.pq9gz.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })
let collection = null;
let cardCollection = null;
client.connect(err => {
    collection = client.db("data").collection("test") 
    cardCollection = client.db("data").collection("cardtest")
})
      
/*app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})*/
app.use(function(req, res, next) {
    console.log(req.url)//logs files requested.
    next()
})
app.use(express.static('public'))
/*app.get("/dreams", (req, res)=>{
    res.json(users)
})*/
//add new data to server (use post!)
app.post("/signup", bodyParser.json(), (req, res) => {
    console.log('RECEIVED POGU')
    collection.insertOne(req.body).then(dbresponse=>{console.log(dbresponse)}) //instead of console.log we can res.json it back
                                                                              //via dbresponse.ops[0] maybe idk 
    //res.json('success') //TODO: make this be success, or failure (user already exists?)
    //errormsg:''
    res.json({username:req.body.username, status:'success'})
})
app.post("/login", bodyParser.json(), (req, res)=> {
    collection.findOne({username:req.body.username, password:req.body.password}, (err, result)=> {
        console.log(result)
        if(err) throw err
        if(result==null) res.json({status:"failed"})
        else res.json({username: result.username, status:"success"})
    })
})
app.post("/add", bodyParser.json(), (req, res)=> {
    cardCollection.insertOne(req.body).then(r=>{
        //res.json({n:r.ops[0].name, m:r.ops[0].manacosst, t:r.ops[0].type, a:r.ops[0].abilities, f:r.ops[0].flavortext, rr: r.ops[0].rarity})
        res.json(r.ops[0])
    })
     //idk i don't really need to send stuff
})

app.post('/load', bodyParser.json(), (req,res)=>{
    cardCollection.find({username:req.body.username}).toArray((err,results)=> {
        res.json(results)
    })
})
app.post('/edit', bodyParser.json(), (req,res)=> {
    console.log("HELLO HELLO")
    console.log(req.body.id)
    cardCollection.updateOne({_id:mongodb.ObjectID(req.body.id)},{$set:{name:req.body.name, manacost:req.body.manacost, type:req.body.type, abilities:req.body.abilities, flavortext:req.body.flavortext, rarity:req.body.rarity}})
    .then(result=>res.json(result))
})
app.post('/remove', bodyParser.json(), (req,res)=> {
    cardCollection.deleteOne({_id:mongodb.ObjectID(req.body.id)})
    .then(result=>res.json(result))
})

app.listen(3000)
//can use compression for images uploaded by user. useful for showing card.
//can look into using cookies for storing user data. (can just use country for now lmao)
//use errorhandler (see docs for examples)
//can use some stuff for logging for fun

//before doing the above, let us see if we can get OAUTH to work for github.
//Use MS Teams for HELP and can ask wpi ppl too for help.

//below is all testing stuff