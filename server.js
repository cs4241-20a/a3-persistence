//Allow for use of .env file
require("dotenv").config();

const fs   = require("fs"),
      express = require("express"),
      app = express(),
      mongo = require("mongodb"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      morganLogger = require("morgan"),
      port = process.env.PORT || 3000;

app.listen(port);

/////////////////// Middleware Initialization /////////////////////////
//Automatically send out contents of public folder
app.use(express.static("./public"));

//Set up logging of incoming requests
let logfile = fs.createWriteStream("serverRequests.log");
app.use(morganLogger('common', {stream: logfile}));

//Set up Passport for Github authentication based on Passport documentation:
//http://www.passportjs.org/docs/configure/
app.use(passport.initialize());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, id);
});

let GitHubStrategy = require('passport-github').Strategy;
passport.use("github", new GitHubStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));

//Routes for Github authentication, based on passport documentation.
let username = null;
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github'),
    function(request, response) {
        username = request.user.username;
        handleUser(username, true, "", response);
    }
);

let newUser = false;//used to indicate whether or not to alert client of new account
app.get("/app", function(request, response){
    //The "new" header will tell the client whether or not they need to
    //display a new message to the user that a new account was created.
    response.sendFile("./public/app.html", {root: "./", headers:{"new": newUser}}, function(error){
        if(error){
            console.log("Error occurred sending app.html: " +error);
        }
        newUser = false;
    });
});

//Route for signing into the application with a username and password
app.post("/signin", bodyParser.json(), function(request, response){
    if(request.body.username && request.body.password){
        username = request.body.username;
        handleUser(request.body.username, false, request.body.password, response);
    }else{
        response.statusCode = 400;
        response.end("username and/or password not provided");
    }
});

/**
 * Handle the login of a user into the application. Will either load running
 * totals and averages for existing user, or will add new totals and averages
 * (set to 0) into the database for a new user. After a laod or add, the
 * reponse will be populated with a redirect to /app.
 *
 * @param username the username of the account trying to login.
 * @param isGithub true if this is a Github account, false if login was via a
 *     <b>username</b> and <b>password</b>.
 * @param password the password of the account trying to login. If <b>isGithub</b>
 *     is false, this value will be ignored.
 * @param response the HTTP response to populate with the status of the login
 *     operation one complete.
 */
const handleUser = function(username, isGithub, password, response){
    //this.username = username;
    let users = client.db("FPS_Stats").collection("users");
    let user = {
        username: username,
        isGithub: isGithub,
        password: password
    };
    users.find(user, {}).toArray(function(error, result){
        if(error){
            console.log("Error looking up user in database: " +error);
        }else if(result.length < 0 || result.length > 1){
            console.log("Unexpected number of users found in database: " +result.length);
        }else{
            if(result.length === 1) {//User exists
                getUserDbInfo(user.username).then(function(result){
                    console.log("User: " + username + " has signed in.");
                    response.redirect("/app");
                });
            }else{//User does not exist
                console.log("new user: " +username +" signing in.");
                addNewDbUser(user).then(function(results){
                    newUser = true;
                    response.redirect("/app");
                    response.statusCode = 201;
                });
            }
        }
    });
}
///////////////////////////////////////////////////////////////////////

/////////////////// Database Initialization ///////////////////////////
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;//Will use to search for documents by their ObjectId strings
const uri = `mongodb+srv://${process.env.name}:${process.env.password}@cs4241-a3.catjb.gcp.mongodb.net/CS4241?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err){
        console.log("error connecting to database: " +err);
    }else{
        console.log("Database connected");
    }
});

/**
 * Retrieve the totals and averages for the user with the given
 * <b>username</b>. Theses values are the placed in the following
 * globals variables: totalKills, totalAssists, totalDeath,
 * totalEntries, avgKills, avgAssists, avgDeaths. The purpose of
 * this is to have local copies of these running totals to
 * prevent having to wait in two extra database queries (get and set)
 * whenever the user adds/modifies/deletes data.
 *
 * @param username the username of the account whose totals and
 *     averages are to be loaded.
 * @returns {Promise} a Promise that will be resolved once
 *     the data has been retrieved and loaded into the corresponding
 *     global variables, or if an error occurs.
 */
const getUserDbInfo = function(username){
    return new Promise(function(resolve, reject) {
        //Retrieve the running totals and averages
        let promises = [];
        promises.push(getTotals(username));
        promises.push(getAverages(username));
        Promise.all(promises).then(function (results) {
            let totalsLoaded = false;
            let avgsLoaded = false;
            if (results[0].length !== 4) {
                console.log("Found unexpected number of totals on server startup: " + results[0].length);
            } else {
                totalKills = results[0][0].amount;
                totalAssists = results[0][1].amount;
                totalDeaths = results[0][2].amount;
                numEntries = results[0][3].amount;
                totalsLoaded = true;
            }
            if (results[1].length !== 3) {
                console.log("Found unexpected number of averages on server startup: " + results[1].length);
            } else {
                avgKills = results[1][0].amount;
                avgAssists = results[1][1].amount;
                avgDeaths = results[1][2].amount;
                avgsLoaded = true;
            }
            if(totalsLoaded && avgsLoaded){
                resolve(true);
            }else{
                reject("Unable to load both totals and averages for given user");
            }
        });
    });
}

/**
 * Add a new user to the database with the given user account
 * information. This will place a new user entry into the
 * users collection of the database, as well as totals and
 * averages, all set to 0, to their respective collections. The
 * given <b>user</b> should be an object with the following
 * fields:
 *     user {
 *         username: String
 *         isGithub: boolean
 *         password: String
 *     }
 *
 * @param user the user to be added to the database
 * @returns {Promise<[]>} A Promise that will resolve once
 * the user and its totals and averages have all been inserted into
 * their respective collections, or reject on failure to do so. The
 * promise will return an array of results in which:
 *     results[0] = results of adding user to "users" collection
 *     results[1] = result of adding totals to "totals" collection
 *     results[2] = result of adding averages to "averages" collection
 */
const addNewDbUser = function(user){
    let users = client.db("FPS_Stats").collection("users");
    let totals = client.db("FPS_Stats").collection("totals");
    let avgs = client.db("FPS_Stats").collection("averages");
    let promises = [];
    promises.push(users.insertOne(user, {}));
    promises.push(totals.insertMany([
        {username: user.username, type: "kills", amount: 0},
        {username: user.username, type: "assists", amount: 0},
        {username: user.username, type: "deaths", amount: 0},
        {username: user.username, type: "entries", amount: 0}
    ]));
    promises.push(avgs.insertMany([
        {username: user.username, type: "kills", amount: 0},
        {username: user.username, type: "assists", amount: 0},
        {username: user.username, type: "deaths", amount: 0},
    ]));
    return Promise.all(promises);
}
///////////////////////////////////////////////////////////////////////

//Decimal precision for derived stats to prevent repeating decimal
//number from stretching the client table to far.
const DECIMAL_PRECISION = 2;

//Global variables and constants used to maintain state without
//constant database queries. Track running totals and averages of
//all three main stats
let numEntries = 0;//Number of rows of stats
let totalKills = 0;
let totalAssists = 0;
let totalDeaths = 0;
let avgKills = 0;
let avgAssists = 0;
let avgDeaths = 0;

/////////////////// Additional Middleware /////////////////////////////
/**
 * Converts the stats given in the HTTP request to Numbers, and stores
 * them back into <b>request.body</b>. The following fields will be
 * checked for in the request:
 *      id:
 *      kills:
 *      assists:
 *      deaths:
 *      rows: [{id, kills, assists, deaths}, ...]
 * Any field that is found will have its corresponding value converted
 * to a Number
 *
 * @param request the HTTP request to convert the fields of to Numbers.
 * @param response the HTTP response to be populated with the results of
 *     the <b>request</b> (will not be modified by this function).
 * @param next the next middleware function to call
 */
const convertDataToNum = function(request, response, next){
    if(request.body.hasOwnProperty("id"))
        request.body.id = parseInt(request.body.id, 10);

    if(request.body.hasOwnProperty("kills"))
        request.body.kills = parseInt(request.body.kills, 10);

    if(request.body.hasOwnProperty("assists"))
        request.body.assists = parseInt(request.body.assists, 10);

    if(request.body.hasOwnProperty("deaths"))
        request.body.deaths = parseInt(request.body.deaths, 10);

    if(request.body.hasOwnProperty("rows")){
        for(let i = 0; i < request.body.rows.length; i++){
            request.body.rows[i].kills = parseInt(request.body.rows[i].kills, 10);
            request.body.rows[i].assists = parseInt(request.body.rows[i].assists, 10);
            request.body.rows[i].deaths = parseInt(request.body.rows[i].deaths, 10);
        }
    }

    next();
}

/**
 * Check if a user has signed in. If not, return a 400 error here
 * stating that the action cannot take place because no one has signed
 * in. This prevents users from bypassing the login page by going straight
 * to "./app.html"
 *
 * @param request the HTTP request to either block or let go through,
 *     depending on whether ot not a user has signed in yet.
 * @param response the HTTP reponse to be populated. If a user has not
 *     signed in yet, this will be populated with a status code of 400
 *     with a corresponding error message. Otherwise, it will not be
 *     modified.
 * @param next the next middleware function to be called.
 */
const checkForAccount = function(request, response, next){
    if(!username){
        response.statusCode = 400;
        response.end("Requester is not signed into a valid account");
    }else {
        next();
    }
}
///////////////////////////////////////////////////////////////////////

////////////////////// POST Request Handlers //////////////////////////
/**
 * Add the item stored in <b>request</b> into the database. This set
 * of stats is assigned an unique ID number as well.
 *
 * @param request the HTTP response containing the data to add to the
 *     database
 * @param response the HTTP response to be populated with the results
 *     of the request. If addition was successful, this response will
 *     be populated with the entire table of data for the current
 *     user so the client can display the most up-to-date information.
 */
const addItem = function(request, response){
    if (Number.isNaN(request.body.kills) || request.body.kills < 0 ||
        Number.isNaN(request.body.assists) || request.body.assists < 0 ||
        Number.isNaN(request.body.deaths) || request.body.deaths < 0){
            response.writeHead(400, "Add request failed, invalid stats", {"Content-Type": "text/plain"});
            response.end();
            return;
    }

    //Calculated derived fields and prepare the object to be inserted.
    let ratios = calculateKDandAD(request.body.kills, request.body.assists, request.body.deaths);
    let obj = {
        "username": username,
        "kills": request.body.kills,
        "assists": request.body.assists,
        "deaths": request.body.deaths,
        "kd_ratio": ratios.kd_ratio,
        "ad_ratio": ratios.ad_ratio
    };

    //Update both local and remote copies of the running stats.
    update(1, request.body.kills, request.body.assists, request.body.deaths);

    //Finally, insert the object into the database.
    let collection = client.db("FPS_Stats").collection("game_stats");
    collection.insertOne(obj, {}, function(error, result){
        if(error){
            console.log("error occurred adding item: " +error);
            return;
        }
        //Now that insertion has finished, can send the updated table
        //back to the user.
        sendTable(response);
    });
}
//Route for add requests
app.post("/add", [checkForAccount, bodyParser.json(), convertDataToNum], addItem);

/**
 * Modify the rows in the database with the given stats. For all the
 * rows modified, the new values will be used in the corresponding
 * fields for all rows, meaning they will each have the same values
 * for those fields. Non-modified fields will remained different
 * between the rows. Rows with invalid stats will not be modified.
 *
 * @param request the HTTP response contain the data to modify in the
 *    database.
 * @param response the HTTP response to be populated with the results of
 *     the request. If modification was successful, this response will
 *     be populated with the entire table of data for the current
 *     user so the client can display the most up-to-date information.
 * @return {boolean} true on successful modification, false otherwise.
 */
const modifyItem = function(request, response){
    //Determine which fields were actually provided for modification
    let fieldsToUpdate = {};
    if(valid(request.body.kills)){
        fieldsToUpdate["kills"] = request.body.kills;
    }
    if(valid(request.body.assists)){
        fieldsToUpdate["assists"] = request.body.assists;
    }
    if(valid(request.body.deaths)){
        fieldsToUpdate["deaths"] = request.body.deaths;
    }

    let game_stats = client.db("FPS_Stats").collection("game_stats");
    let rows = request.body.rows;

    //Have to use updateOne since each row will have a new kd ratio and ad
    //ratio based on the stats that were not modified in their respective rows.
    //So collect all promises and use Promise.all to only send table once all
    //all modifications are done.
    let promises = [];
    for(let i = 0; i < rows.length; i++){
        let item = rows[i];
        if((isNaN(item.kills) || item.kills < 0 ) ||
            (isNaN(item.assists) || item.assists < 0) ||
            (isNaN(item.deaths) || item.deaths < 0)){
            console.log(`Skipping modify of ${item._id}, invalid stats`);
        }else {
            let id = new ObjectID(item.id);

            let updatedObj = {
                kills: valid(request.body.kills) ? request.body.kills : item.kills,
                assists: valid(request.body.assists) ? request.body.assists : item.assists,
                deaths: valid(request.body.deaths) ? request.body.deaths : item.deaths,
            }
            let ratios = calculateKDandAD(updatedObj.kills, updatedObj.assists, updatedObj.deaths);
            updatedObj.kd_ratio = ratios.kd_ratio;
            updatedObj.ad_ratio = ratios.ad_ratio;

            //Delete old stats, and add back the new ones
            update(0, -item.kills, -item.assists, -item.deaths);
            update(0, updatedObj.kills, updatedObj.assists, updatedObj.deaths);
            promises.push(game_stats.updateOne({username: username, _id: id}, {$set: updatedObj}));
        }
    }

    //Once all modifications have finished, safely send the new table
    Promise.all(promises).then(function(results){
        console.log("all modifications done, sending table");
        sendTable(response);
    });
}
//Route for modification
app.post("/modify", [checkForAccount, bodyParser.json(), convertDataToNum], modifyItem);

/**
 * Determine if teh given <b>value</b> is not NaN and is greater than
 * or equal to 0.
 *
 * @param value the value to determine the validity ofl
 * @returns {boolean} true if the value is valid i.e. not NaN and
 *     greater than 0, false otherwise.
 */
const valid = function(value){
    return (!isNaN(value) && value >= 0);
}

/**
 * Delete the given rows from the database. Rows with invalid values
 * will be skipped.
 *
 * @param request the HTTP response containing the IDs of all the rows
 *     to delete from the database.
 * @param response the HTTP response to be populated with the results of
 *     the request. If deletion was successful, this response will
 *     be populated with the entire table of data for the current
 *     user so the client can display the most up-to-date information.
 */
const deleteItem = function(request, response){
    let game_stats = client.db("FPS_Stats").collection("game_stats");
    let rows = request.body.rows;
    let ids = [];//Array of ids to be provided for the deletion query.

    //Go through each item to be deleted, and update the local and remote
    //variables for totals and averages.
    for(let i = 0; i < rows.length; i++){
        let item = rows[i];
        if((isNaN(item.kills) || item.kills < 0 ) ||
           (isNaN(item.assists) || item.assists < 0) ||
           (isNaN(item.deaths) || item.deaths < 0)){
            console.log(`Skipping deletion of ${item.id}, invalid stats`);
        }else {
            ids.push(new ObjectID(item.id));
            update(-1, -item.kills, -item.assists, -item.deaths);
        }
    }

    //Not that all running stats are updated, erase from database.
    game_stats.deleteMany({username: username, _id: {$in: ids}}, function(error, result){
        if (error) {
            console.log("Error occurred during deletion: " + error);
        }else{
            sendTable(response);
        }
    });
}
//Route for deletion
app.post("/delete", [checkForAccount, bodyParser.json(), convertDataToNum], deleteItem);
//////////////////////////////////////////////////////////////////////

/////////////////////// GET Request Handlers //////////////////////////
/**
 * Populates the given HTTP response with a JSON object that contains
 * all the data for the current user for the total_avg_results and
 * result_list tables in  app.html. This JSON object is  then stored
 * in <b>response</b> and the headers are set.
 *
 * The format of the JSON object is as follows:
 * {
 *     numRows: ,
 *     rows: [
 *         { "id": , "kills": , "assists": , "deaths": , "kd_ratio": , "ad_ratio": },
 *         ...
 *         { "id": , "kills": , "assists": , "deaths": , "kd_ratio": , "ad_ratio": },
 *     ],
 *     totals: {
 *         kills:
 *         assists:
 *         deaths:
 *         entries:
 *     },
 *     avgs: {
 *         kills:
 *         assists:
 *         deaths:
 *     }
 * }
 *
 * @param response an HTTP response that will populated with a JSON object that
 *      contains every row of appdata as well as total and average number of kills,
 *      assists and deaths.
 */
const sendTable = function(response){
    let json = {
        "numRows": 0,
        "rows": [],
        "totals": [],
        "avgs": [],
    }
    getAllStats().then(function(result){
            json["numRows"] = result.length;
            json["rows"] = result;
            json["totals"] = {
                kills: totalKills,
                assists: totalAssists,
                deaths: totalDeaths
            }
            json["avgs"] = {
                kills: avgKills,
                assists: avgAssists,
                deaths: avgDeaths
            }
            response.json(json);
    });
}
//Route for getting current stats.
app.get('/results', checkForAccount, function(request, response){
    sendTable(response);
});

/**
 * Gets all game stats for the current user from the "game_stats"
 * collection.
 *
 * @returns {Promise|void|any[]} a Promise that will resolve once
 *     all game stats have been retrieved. The resolved promise will
 *     return an array of the all the stats.
 */
const getAllStats = function(){
    let game_stats = client.db("FPS_Stats").collection("game_stats");
    return game_stats.find({username: username}).toArray();
}

/**
 * Gets all totals for the current user from the "totals" collection.
 *
 * @returns {Promise|void|any[]} a Promise that will resolve once
 *     all totals have been retrieved. The resolved promise will return
 *     an array of the all the totals.
 */
const getTotals = function(username){
    let totals = client.db("FPS_Stats").collection("totals");
    return totals.find({username: username}).toArray();
}

/**
 * Gets all averages for the current user from the "averages"
 * collection.
 *
 * @returns {Promise|void|any[]} a Promise that will resolve once
 *     all averages have been retrieved. The resolved promise will
 *     return an array of the all the totals.
 */
const getAverages = function(username){
    let avgs = client.db("FPS_Stats").collection("averages");
    return avgs.find({username: username}).toArray();
}

/**
 * Populates the given HTTP response with the contents of a stats.csv
 * file, which contains every all totals, averages and game stats for
 * the current user. This response is then stored in <b>response</b>
 * and the headers are set.
 *
 * @param response an HTTP response that will be populated the data for
 *     stats.csv.
 */
const sendCSV = function(response){
    /*
     * The following link from node.js documentation taught how to
     * close and flush write streams: https://nodejs.org/api/stream.html
     */
    let file = fs.createWriteStream("./stats.csv");
    file.write(",Total,Average\n");
    file.write(`Kills,${totalKills},${avgKills}\n`);
    file.write(`Assists,${totalAssists},${avgAssists}\n`);
    file.write(`Deaths,${totalDeaths},${avgDeaths}\n\n`);

    file.write("Kills,Assists,Deaths,K/D Ratio,A/D Ratio\n");
    getAllStats().then(function(result){
        for(let i = 0; i < numEntries; i++){
            file.write(`${result[i]["kills"]}, ${result[i]["assists"]}, ${result[i]["deaths"]}, ${result[i]["kd_ratio"]}, ${result[i]["ad_ratio"]}\n`);
        }
        file.on("finish", function(){
            //Whole file has now been written, so send.
            response.sendFile("./stats.csv", {root: "./" }, function(error){
                if(error){
                    console.log("Error occurred sending file: " +error);
                }
            });
        });
        file.end();
    })
}
//Route for getting a CSV file of all the current user's stats.
app.get('/csv', checkForAccount, function(request, response){
    sendCSV(response);
});

/**
 * Wipe all the data stored on the server for the given user. Returns a
 * json object indicating an empty table so app.html knows to display
 * an empty table.
 *
 * @param response an HTTP response that will be populated with an
 *     empty table to indicate that server data has been wiped.
 */
const clearStats = function(response){
    function handleClear(error, result){
        if(error){
            console.log("Error occurred during clear: " +error);
        }
    }

    numEntries = 0;
    totalKills = totalAssists = totalDeaths = 0;
    avgKills = avgAssists = avgDeaths = 0;

    //Set all running stats back to zero
    let total = client.db("FPS_Stats").collection("totals");
    total.updateMany({username: username, type: {$in: ["kills", "assists", "deaths", "entries"]}}, {$set: {amount: 0}}, handleClear);

    let avgs = client.db("FPS_Stats").collection("averages");
    avgs.updateMany({username: username, type: {$in: ["kills", "assists", "deaths"]}}, {$set: {amount: 0}}, handleClear);

    //Clear the entire game_stats collection
    let game_stats = client.db("FPS_Stats").collection("game_stats");
    game_stats.deleteMany({username: username}, handleClear);
    sendTable(response);
}
//Route for clearing the current user's data.
app.get('/clear', checkForAccount, function(request, response){
    clearStats(response);
});
///////////////////////////////////////////////////////////////////////

////////////////////// Data Processing ////////////////////////////////
/**
 * Calculates the kill/death ratio and assist/death ratio based on the
 * given set of <b>kills</b>, <b>assists</b> and <b>deaths</b>.
 *
 * @param kills number of kills from the game
 * @param assists number of assists from the game
 * @param deaths number of deaths from the game
 */
const calculateKDandAD = function(kills, assists, deaths){
    let kd, ad;
    //We want to avoid divide by zero errors, but still allows for 0 deaths.
    //If there are 0 deaths, FPS games traditionally treat K/D = # kill and
    //A/D as assists
    if(deaths === 0) {
        kd = kills;
        ad = assists;
    }else{
        kd = parseFloat((kills / deaths).toFixed(DECIMAL_PRECISION));
        ad = parseFloat((assists / deaths).toFixed(DECIMAL_PRECISION));
    }
    return {
        kd_ratio: kd,
        ad_ratio: ad
    }
}

/**
 * Update the local and database copies of the totals, averages and
 * number of entries for the current user.
 *
 * @param entriesDelta the amount to increase or decrease the number of entries by.
 * @param kills the number of kills to update the total and average with.
 * @param assists the number of assists to update the total and average with.
 * @param deaths the number of deaths to update the total and average with.
 */
const update = function(entriesDelta, kills, assists, deaths){
    updateNumEntries(entriesDelta);
    updateTotals(kills, assists, deaths);
    updateAvgs();
}

/**
 * Update the local and database copies of the number of entries
 * (games) that have stats recorded for the current user.
 *
 * @param delta the amount of increase or decrease the number of
 *     entries by.
 * @returns {Promise} A Promise that will be resolved once the total
 *     number of entries for the given user has been updated in the
 *     database. The Promise will return the result of the call to
 *     update the total number of entries.
 */
const updateNumEntries = function(delta){
    numEntries += delta;
    let totals = client.db("FPS_Stats").collection("totals");
    return totals.updateOne({username: username, type: "entries"}, {$inc: {amount: delta}});
}

/**
 * Updates the local and database copies of the total kills, assists
 * and deaths for the current user by taking into account the new set
 * of <b>kills</b>, <b>assists</b> and <b>deaths</b>.
 *
 * @param kills number of kills from the game
 * @param assists number of assists from the game
 * @param deaths number of deaths from the game
 * @return {Promise<[]>} a Promise that will be resolved once all the
 *     totals in the database for the current user have been updated.
 *     The Promise will return an array of results in which the three
 *     elements are the results of the calls to update total kills,
 *     assists and deaths, respectively.
 */
const updateTotals = function(kills, assists, deaths){
    totalKills += kills;
    totalAssists += assists;
    totalDeaths += deaths;
    let totals = client.db("FPS_Stats").collection("totals");
    let promises = [];
    promises.push(totals.updateOne({username: username, type: "kills"}, {$inc: {amount: kills}}, {}));
    promises.push(totals.updateOne({username: username, type: "assists"}, {$inc: {amount: assists}}, {}));
    promises.push(totals.updateOne({username: username, type: "deaths"}, {$inc: {amount: deaths}}, {}));
    return Promise.all(promises);
}

/**
 * Updates the local and database copies of the average kills, assists
 * and deaths for the current user by taking into account the current
 * values of the totalKills, totalsAssists and totalDeaths.
 *
 * @return {Promise<[]>} a Promise that will be resolved once all the
 *     averages in the database for the current user have been updated.
 *     The Promise will return an array of results in which the three
 *     elements are the results of the calls to update average kills,
 *     assists and deaths, respectively.
 */
const updateAvgs = function() {
    if(numEntries <= 0){
        numEntries = 0;
        avgKills = 0;
        avgAssists = 0;
        avgDeaths = 0;
    }else{
        avgKills = parseFloat((totalKills / numEntries).toFixed(DECIMAL_PRECISION));
        avgAssists = parseFloat((totalAssists / numEntries).toFixed(DECIMAL_PRECISION));
        avgDeaths = parseFloat((totalDeaths / numEntries).toFixed(DECIMAL_PRECISION));
    }
    let avgs = client.db("FPS_Stats").collection("averages");
    let promises = [];
    promises.push(avgs.updateOne({username: username, type: "kills"}, {$set: {amount: avgKills}}, {}));
    promises.push(avgs.updateOne({username: username, type: "assists"}, {$set: {amount: avgAssists}}, {}));
    promises.push(avgs.updateOne({username: username, type: "deaths"}, {$set: {amount: avgDeaths}}, {}));
    return Promise.all(promises);
}
///////////////////////////////////////////////////////////////////////