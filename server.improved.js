const express = require('express'),
      mongodb = require("mongodb"),
      bodyparser = require('body-parser'),
      cors = require("cors"),
      GitHubStrategy = require('passport-github').Strategy,
      cookieParser = require('cookie-parser'),
      passport = require('passport'),
      session = require("express-session"),
      app = express()

app.use(express.static('public'))
//app.use(cookieParser("cats"));
app.use(session({ secret: "cats" }))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html")
})

app.get("/browse", function(req, res) {
  res.sendFile(__dirname + "/public/browse.html");
})

app.post("/delete_recipe", bodyparser.json(), function(req, res) {
  
  if(req.user)
  {
    if(req.body.delete_from_db === true)
    {
        //in this case we should delete the recipe from the whole database
        console.log("checkbox was checked! deleting from entire database...");
        recipes.deleteOne({_id: mongodb.ObjectId(req.body.recipe_id)});
    }
    //in any case we should remove it from the user's cookbook.
    console.log("removing recipe id ", req.body.recipe_id, " from user's cookbook.");
    cookbooks.updateOne({owner: req.user.username}, { $pull: {recipes: req.body.recipe_id}}).then( response => res.end(JSON.stringify(JSON.stringify({deleted_id: req.body.recipe_id}))));
  }else{
    console.log("Error. No user for delete request.");
  }
  
})

app.post('/add_recipe', bodyparser.json(), function(req, res){

  console.log("request: ", req.body);
  var jsonData = req.body;
  if(req.user)
  {
    jsonData["user_added"] = req.user.username;
    recipes.insertOne(jsonData);
    res.end(JSON.stringify(jsonData));
  }else{
    console.log("error: no user for add recipe request. ");
  }
  
  res.end(JSON.stringify(req.body));
})

app.post('/add_to_cookbook', bodyparser.json(), function(req, res){
    
  var jsonData = req.body;
  if(req.user)
  {
    if(jsonData.recipe_id)
    {
      const query = { owner: req.user.username };
      cookbooks.updateOne(query, {$push: { recipes: jsonData.recipe_id}})
      res.end(JSON.stringify(jsonData));
    }    
  }else{
    console.log("error. No user for adding recipe to cookbook.")
  }
  
})

app.post('/get_cookbook_recipes', bodyparser.json(), function(req, res) {
  console.log("get cookbook hit! ");
  if(req.user)
  {
    console.log("username: ", req.user.username);
    console.log("req.body: ", req.body);
    //may have to call mongo.ObjectId or whatever
    var idArray = []
    for(var i = 0; i < req.body.recipes.length; i++)
    {
        idArray.push(mongodb.ObjectId(req.body.recipes[i]))
    }
    
    const query = { _id: {$in: idArray } };
    
    recipes.find(query).toArray().then(function (jsonData) {
      console.log("returning list of recipe objects... ");
      res.end(JSON.stringify({recipes: jsonData}));
    })
    
  }else{
    console.log("no user defined for request.");
  }
  
})

app.get('/get_cookbook', function(req, res) {
  console.log("get cookbook hit! ");
  if(req.user)
  {
    console.log("username: ", req.user.username);    
    const query = { owner: req.user.username };
    
    if(cookbooks)
    {
      //console.log("cookbooks: ", cookbooks);
      cookbooks.findOne(query, null).then(function(data) {
        if(data)
        {
            return data;
        }else{
            var newCookbook = {
              owner: req.user.username,
              recipes: []
            }
            return cookbooks.insertOne(newCookbook).then(function(newData){return newData});
        }
      }).then(function(jsonData) {
      
      
      res.end(JSON.stringify(jsonData));
    
    })    
    }else{
      console.log("cookbooks is not defined. ");
    }
    
  
  }else{
    console.log("no user defined for request.");
  }
  
  //check database for user's cookbook, if it exists.
  //if it doesn't exist, create it. 
  
})

app.get("/get_recipe", function(req, res) {
  
  if(req.query.recipe_id)
  {
      recipes.findOne({_id: mongodb.ObjectId(req.query.recipe_id)}).then(result => res.end(JSON.stringify(result)));
  }else{
    res.end();
  }
  
})

app.get("/get_recipes", function(req, res) {
  recipes.find({}).toArray().then( function(result) {
    res.end(JSON.stringify(result));
  });
})

passport.use(new GitHubStrategy({
    clientID: "9b442249b3b73e74c79c",
    clientSecret: "CLIENT_SECRET",
    callbackURL: "https://a3-noah-parker.glitch.me/auth_callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("user authenticated!");
    cb(null, profile);
  }
));

app.get("/authenticate", passport.authenticate('github'));

app.get("/auth_callback", 
  passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
    console.log("redirecting...");
    res.redirect('/home');
  })

app.get("/home", function(req, res) {
  console.log("home request hit!");
  res.sendFile(__dirname + "/public/cookbook.html")
})

var testRecipe = {
  recipe_title: "Chicken Katsu Curry",
  ingredients: ["chicken", "curry powder", "1 cup rice"],
  user_added: "test-user"
}


const uri = "mongodb+srv://test-user:blah_blah_blah@cluster0.bsxs6.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

let recipes = null;
let cookbooks = null;
client.connect(err => {
  cookbooks = client.db("cookbook_data").collection("cookbooks");
  recipes = client.db("cookbook_data").collection("recipes");
  
  recipes.findOne({ recipe_title: "chicken" }, null).then( function(data) {
    if(data)
      {
        return data.json();
      }else{
        return null;
      }
  })
    .then(jsonData => console.log(jsonData));
  
  
  // perform actions on the collection object
  // recipes.find({}).toArray().then( function(result) {
  //   console.log(result)
  // });
  //collection.insertOne(testRecipe)
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //console.log("deserializing user");
  done(null, user);
});


app.listen(3000)
