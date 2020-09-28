const { response } = require("express");

require("dotenv").config();

const express = require("express"),
  serveStatic = require("serve-static"), //1
  path = require("path"),
  serveFavicon = require("serve-favicon"), //2
  app = express(),
  MongoClient = require("mongodb").MongoClient,
  { spawn } = require("child_process"),
  session = require("express-session"), //3
  bodyParser = require("body-parser"), //4
  passport = require("passport"), //5
  multer = require("multer"), //6
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt"),
  mongoUri =  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@a3.xvhzl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect()
// client.connect((err) => {
//   collection = client.db(process.env.DB_NAME).collection("data");
//   // perform actions on the collection object
// });
app.use(bodyParser.json())

// const userReg = (username, password, email) => {
//     console.log('user reg')
//     return new Promise((resolve, reject) => {
//         console.log(username, password, email)
//         resolve({success: "YTeakn"})
//         // client.connect((err) => {
//         //     if(!!err){
//         //         reject("Failed to Connect")
//         //     }
//         //     const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
//         //     collection.findOne({"username": username})
//         //         .then((result) => {
//         //             if(!!result){
//         //                 reject("User Exists")
//         //             }
//         //             else{
//         //                 bcrypt.genSalt(10, (err, salt) => {
//         //                     if(err){
//         //                         console.log(err)
//         //                         reject("Salt Error")
//         //                     }
//         //                     bcrypt.hash(password, salt, (err, hash) => {
//         //                         console.log(hash)
//         //                         if(err){
//         //                             console.log(err)
//         //                             reject("Encryption Error")
//         //                         }
//         //                         const user = {
//         //                             username,
//         //                             email, 
//         //                             password: hash
//         //                         }
//         //                         collection.insertOne(user).then((result) => {
//         //                             console.log("Insert")
//         //                             console.log(result.ops[0])
//         //                             client.close()
//         //                             resolve(result.ops[0])
//         //                         }).catch((err) => {
//         //                             console.log("error")
//         //                             client.close()
//         //                             reject("DB Write Error")
//         //                         })
//         //                     })
//         //                 })
//         //             }
//         //         })
//         // })
//     })
// }

const userLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        console.log("userlogin called")
        resolve({test: "A"})
      //  const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
        // collection.findOne({"username": username}).then((result) => {
        //     console.log("Collection search")
        //     if(!result){
        //         console.log("No User Exists")
        //         reject(false)
        //     }
        //     bcrypt.compare(password, result.password).then((loggedIn) => {
        //         console.log("password true")
        //         console.log(loggedIn)
        //         resolve(result)
        //     }).catch((err) => {
        //         console.log("password incorrect")
        //         console.log(err)
        //         reject("Bad Password")
        //     })
        // })
    })   
}

app.use(session({
    secret: "bionicle",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
app.use(passport.initialize())
app.use(passport.session())

// passport.use('local-registration', new LocalStrategy({passReqToCallback: true}, 
//     function(req, username, password, done) {
//         console.log("BReEt")
//         userReg(username, password, req.body.email).then((result) => {
//             console.log("userreg fine")
//             console.log(result)
//             done(null, result)
//         }).catch((err) => {
//             console.log("BREIAAA")
//             console.log(err)
//             done(null, {user: '1'})
//         })
//     }
// ))



passport.use('local-login', new LocalStrategy({passReqToCallback: true},
    function(req,username, password, done) {
        console.log("local login called")
        userLogin(username, password).then((result) => {
            console.log("Local success")
            console.log(result)
            done(null, result)
        }).catch((err) => {
            console.log("failed login")
            done("Failed Login", false)
        })
    }
))

app.use(serveFavicon(path.join(__dirname, 'public/statics', 'favicon.ico')))

app.use(
  serveStatic(path.join(__dirname, "public/statics"), {
    index: "index.html",
    extensions: ["html"],
  })
)

// app.post('/register', (req, res, next) => {
//     passport.authenticate('local-registration', function(err, user, info){
//         console.log(user)
//         res.writeHead(200)
//         res.end(JSON.stringify({Success: "Yeet"}))
//         next()
//     })(req,res,next)
// })

app.post('/test', (req, res, next) => {
    console.log(req)
    console.log(req.user)
    res.writeHead(200)
    res.end()
})

app.post('/logout', (req, res, next) => {
    console.log('logout')
    req.logout()
    res.writeHead(200)
    res.end()
})


passport.serializeUser((user, done) => {
    console.log("serializing user")
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log('deserializin user')
    console.log(id)
    done(null, {test: 'deserialize'})
})


app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', function(err, user, info){
        console.log(req.user)
        console.log(user)
        console.log(err)
        console.log(info)
        console.log('F')
        res.writeHead(200)
        res.end(JSON.stringify({a: 2}))
    })(req,res,next)
})

//Running a python script in the console
// let enddata = '';
// const python = spawn('python3', ['./lib/xml2abc.py'])
// python.stdout.on('data', function(data) {
//     console.log('pipe data from python script ,,,')
//     enddata += data.toString()
// })
// python.on('close', (code) => {
//     console.log(`child process close all stdio with code ${code}`)
//     console.log(enddata.slice(0,-1))
// })

app.listen(3000);
//XML upload => python run local => abc string => abcjs
//In abcjs call synth.getMidiFile(abcstring, {midiOutputType = 'binary'})
//Load this into tonejs with const midi = new Midi(midiData)
