

const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const mongodb = require('mongodb')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const MongoClient = mongodb.MongoClient;
app     = express()

const tempData = [
    "test"
]



const uri = `mongodb+srv://tlarson:${process.env.MONGOPASS}@cluster0.wh7oc.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.use( express.static('./'))

app.get( "/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html")
})

app.get( "/db", (request, response) => {
    response.json(tempData)
})

app.post( "/add", bodyParser.json(), (request, response) => {
    //console.log(request.body)
    collection.insertOne(request.body).then(dbresponse => {
        console.log(dbresponse)
        response.json(dbresponse.ops[0])
    })
    //response.json(tempData)
})

const listener = app.listen(process.env.PORT, () => {
    console.log("Listening on port " + listener.address().port)
})