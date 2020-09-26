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
const uri = "mongodb+srv://hctrautz:zPhOWsTbSvEnD6cf@taskcollector.rsy8z.mongodb.net/TaskDatabase?retryWrites=true&w=majority";

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

var taskID = 1;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

app.get("/api/getData", async (request, response) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
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
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect()
      const collection = client.db("TaskDatabase").collection("Tasks");
      await collection.deleteOne({_id: new mongodb.ObjectID(object.id)});
      console.log(taskID)
      taskID--;
      const appdata = await collection.find({}).toArray()
      await client.close()
      response.json(appdata)
      return response.end()
    }

    //updating object
    // if(object.hasOwnProperty('id')){
    //   await client.connect()
    //   const collection = client.db("TaskDatabase").collection("Tasks");
    //
    // }

    object.deadline = calculateDeadline(object.priority);
    taskID++;
    object.id = taskID;
    console.log(object)

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect()
    const collection = client.db("TaskDatabase").collection("Tasks");
    await collection.insertOne(object)
    const appdata = await collection.find().toArray()
    await client.close()
    response.json(appdata)
    return response.end()
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
