//server script

const express = require("express"),
  mongodb = require("mongodb"),
  bodyparser = require("body-parser"),
  app = express();

app.use(express.static("views/index.html"));

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'UserData' ).createCollection( 'data' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})
  
app.listen( 3000 )

app.get("/", (req, res) => {
  res.sendFile("./views/index.html");//send login page on default
});

app.get("/secure", (req, res) => {
    res.sendFile("./views/secure.html");//send login page on default
});

app.post("/add",(req,res)=>{

})

app.post("/update",(req,res)=>{
    
})

app.post("/delete",(req,res)=>{
    
})

app.post("/load", (req,res)=>{
    collection.find({}).toArray().then(result=>res.json(result))
})

const serverListener = app.listen(process.env.PORT, () => {
  console.log("Server running on port " + serverListener.address.PORT);
});
