const { MongoClient } = require("mongodb");

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

// Get all recipes from database and resolve
const getAllRecipes = function() {
    return new Promise((resolve, reject) => {
            return client.db("a3-webware").collection("recipes").find({}).toArray((err, result) => {
                if(err) reject(err);
                resolve(result);
            }
            )
        }
    ) 
}

exports.insert = insert;
exports.getAllRecipes = getAllRecipes;