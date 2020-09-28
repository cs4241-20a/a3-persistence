const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;

const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const database = process.env.MONGODB_DATABASE

const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`

const client = new MongoClient(uri);
client.connect();

// run().catch(console.dir)

const insert = async function(document) {
    client.db("a3-webware").collection("recipes").insertOne(document)
    .then((res) => {console.log(res)});
}

// Get recipes from database and resolve
const getRecipes = function(userID) {
  var queryDoc = {};
  if(userID) {
    queryDoc = {"userID": userID};
  }
  return new Promise((resolve, reject) => {
    return client.db("a3-webware").collection("recipes").find(queryDoc).toArray((err, result) => {
      if(err) reject(err);
      resolve(result);
    })
  })
}

// Get recipes from database and resolve
const getRecipesNoID = function(userID) {
  var queryDoc = {};
  if(userID) {
    queryDoc = {"userID": userID};
  }
  return new Promise((resolve, reject) => {
    return client.db("a3-webware").collection("recipes").find(queryDoc, {"_id": 0}).toArray((err, result) => {
      if(err) reject(err);
      resolve(result);
    })
  })
}

const tryDelete = function(userID, recipeID) {
  console.log("recipeID: ", recipeID)
  console.log("userID: ", userID)
  return client.db("a3-webware").collection("recipes").deleteOne({ _id: new ObjectID(recipeID)});//$and: [{_id: recipeID}, {userID: userID}]})
}

exports.insert = insert;
exports.getRecipes = getRecipes;
exports.getRecipesNoID = getRecipesNoID;
exports.tryDelete = tryDelete;