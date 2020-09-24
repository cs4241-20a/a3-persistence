const http = require( 'http' ),
      fs   = require( 'fs' ),
      moment = require('moment'),
      bodyParser = require('body-parser'),
      express = require('express'),
      app     = express(),
      mongodb = require('mongodb'),
      dir  = 'public/'

app.use(express.static('public'))
app.listen(3000)

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://hctrautz:zPhOWsTbSvEnD6cf@taskcluster.rsy8z.mongodb.net/TaskDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const calculateDeadline = function(prio){
  var deadlineVal = 0;
  if(prio === "low"){
      deadlineVal+=4;
  }

  if(prio === "medium"){
    deadlineVal+=2;
  }

  if(prio === "high"){
      deadlineVal++;
  }
  var finalDeadline = moment().add(deadlineVal, "days").format("MM/DD/YYYY")
  return finalDeadline;
}

var taskID = 3;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

app.get("/api/getData", async (request, response) => {
  await client.connect()
  const collection = client.db("TaskDatabase").collection("Tasks");
  const tasks = await collection.find().toArray();
  await client.close()
  return response.json(tasks)
})

//Returns true a task contains the same ID as the object being deleted
const compareIDs = function (task, object){
  if(task.id.toString() === object.val.toString()){
    return true;
  }
  else {
    return false;
  }
}

app.post("/submit", bodyParser.json(), async (request, response) => {
    const object = request.body

    if(object.hasOwnProperty('delete')){
      // appdata.splice(appdata.findIndex(task => compareIDs(task, object)), 1);
      // response.writeHead(200, "OK", {'Content-Type': 'application/json'})
      // response.write(JSON.stringify(appdata));
      // response.end();
      // return false;
    }

    object.deadline = calculateDeadline(object.priority);
    taskID++;
    object.id = taskID;
    console.log(object)

    await client.connect()
    const collection = client.db("TaskDatabase").collection("Tasks");
    await collection.insertOne(object)
      .then(dbresponse => {
        response.json(object)
      });
    await client.close()
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
