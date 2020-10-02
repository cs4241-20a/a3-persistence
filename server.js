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

let userdb = null;
let coursesdb = null;

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbPassword@cluster0.ui701.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    userdb = client.db("a3").collection("users");
    coursesdb = client.db("a3").collection("courses")
    // perform actions on the collection object
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

app.get('/getData', ((req, res) => {

    if (coursesdb !== null) {
        console.log(req.session.user.id)
        coursesdb.find({id: req.session.user.id}).toArray().then(result => {
            res.json(result)
        })
    }

}))

app.get('/getUser', ((req, res) => {
    res.json(req.session.user.id)

}))

app.post('/login', function(req, res){
    if(!req.body.id || !req.body.password){
        res.status("400");
        res.send("Invalid details!");
    } else {
        console.log("made it")

        var newUser = {id: req.body.id, password: req.body.password};
        userdb.findOne({id : req.body.id, password: req.body.password}, function (err, result) {
            if(!result){ // if user does not exist, register a new user
                userdb.insertOne(newUser)
            }
        })
        req.session.user = newUser;
        res.redirect('/home');
    }
});

app.listen(3000);