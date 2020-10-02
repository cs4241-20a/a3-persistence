var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',__dirname + '/views');



app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

var Users = [];
var userExists = false;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbPassword@cluster0.ui701.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("a3").collection("users");
    // perform actions on the collection object
    client.close();
});


app.get("/", (request, response) => {
    response.redirect("/login")
});

app.get("/login", (request,response)=>{
    response.render("login.html");
})
app.get("/home", (request,response)=>{
    response.render("index.html");
})

app.post('/login', function(req, res){
    if(!req.body.id || !req.body.password){
        res.status("400");
        res.send("Invalid details!");
    } else {
        console.log("made it")
        Users.forEach(function(user){
            if(user.id === req.body.id && user.password === req.body.password) {
                userExists = true;
            }
        });
        var newUser = {id: req.body.id, password: req.body.password};
        if(!userExists) {
            Users.push(newUser);
        }
        req.session.user = newUser;
        userExists = false;
        res.redirect('/home');
    }
});

app.listen(3000);