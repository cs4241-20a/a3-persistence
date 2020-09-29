require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.pq9gz.mongodb.net/<dbname>?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true })
let collection = null;
let cardCollection = null;
client.connect(err => {
    collection = client.db("data").collection("accounts") 
    cardCollection = client.db("data").collection("cards")
})
//middlewear      
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
//middlewear for serving  static sites
app.use(express.static('public'))
//more middlewear
app.post("/signup", bodyParser.json(), (req, res) => {
    collection.findOne({username:req.body.username}, (err, result)=> {
        if(err) throw err
        if(result==null)collection.insertOne(req.body).then(dbresponse=>res.json({username:req.body.username, status:'success'}))
        else res.json({status:'failure'})
    })    
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
        res.json(r.ops[0])
    })
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

//below is the code used for OAUTH passport

const cookieSession = require('cookie-session')
const passport = require('passport');
require('./passport')
//cookies as middlewear
app.use(cookieSession({
  name: 'github-auth-session',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/user',(req,res)=>{
  console.log(req.user._json.login)
  res.send({username:req.user._json.login})
  
})
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
//passport as middlewear
app.get('/auth/github',passport.authenticate('github',{ scope: [ 'user:email' ] }));
app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/data.html');
});
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})