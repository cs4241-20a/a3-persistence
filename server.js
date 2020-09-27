const fs   = require("fs"),
      express = require("express"),
      app = express(),
      mongo = require("mongodb"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      serveFavicon = require("serve-favicon"),
      morganLogger = require("morgan"),
      port = process.env.PORT || 3000;

//Allow for use of .env file
require("dotenv").config();

app.use(serveFavicon("./public/favicon.ico"));
let logfile = fs.createWriteStream("serverRequests.log");
app.use(morganLogger('common', {stream: logfile}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

let GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log("profile: " + profile);
        cb(null, profile);
        //User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //  return cb(err, user);
        //});
    }
));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        console.log("here");
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);
app.get('/login', function(request, response){
    response.sendFile("./public/login.html", {root: "./" }, function(error){
        if(error){
            console.log("Error occurred sending file: " +error);
        }
    });
});

const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;//Will use to search for documents by their ObjectId strings
const uri = `mongodb+srv://${process.env.name}:${process.env.password}@cs4241-a3.catjb.gcp.mongodb.net/CS4241?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err){
        console.log("error connecting to database: " +err);
    }
});

app.listen(port);
app.use(express.static("./public"));
app.use(bodyParser.json());

//Format: { "id": 0, "kills": 0, "assists": 0, "deaths": 0, "kd_ratio": 0, "ad_ratio": 0 },
let appdata = [];
const DECIMAL_PRECISION = 2;

let numEntries = 0;//Length of appdata

//Track running totals and averages of all three main stats
let totalKills = 0;
let totalAssists = 0;
let totalDeaths = 0;
let avgKills = 0;
let avgAssists = 0;
let avgDeaths = 0;

/////////////////// Additional Middleware /////////////////////////////
/**
 * Converts the stats given in the HTTP request to Numbers, and stores
 * them back into <b>request.body</b>.
 *
 * @param request the HTTP request to convert "id," "kills," "assists"
 *     and "deaths" fields to Numbers.
 * @param response the HTTP response to be populated with the results of
 *     the request (will not be modified by this function).
 * @param next the next middleware function the call
 */
const convertDataToNum = function(request, response, next){
    console.log(request);
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
///////////////////////////////////////////////////////////////////////

////////////////////// POST Request Handlers //////////////////////////
/**
 * Add the item stored in <b>data</b> into the appdata table. This set
 * of stats is assigned an unique ID number as well.
 *
 * @param request the HTTP response contain the data to add to the table
 * @param response the HTTP response to be populated with the results of
 *     the request
 * @return {boolean} true on successful addition, false otherwise
 */
const addItem = function(request, response){
    if (Number.isNaN(request.body.kills) || request.body.kills < 0 ||
        Number.isNaN(request.body.assists) || request.body.assists < 0 ||
        Number.isNaN(request.body.deaths) || request.body.deaths < 0){
            response.writeHead(400, "Add request failed", {"Content-Type": "text/plain"});
            response.end();
            return false;
    }

    let ratios = calculateKDandAD(request.body.kills, request.body.assists, request.body.deaths);
    let obj = {
        "kills": request.body.kills,
        "assists": request.body.assists,
        "deaths": request.body.deaths,
        "kd_ratio": ratios.kd_ratio,
        "ad_ratio": ratios.ad_ratio
    };

    update(1, request.body.kills, request.body.assists, request.body.deaths);

    let collection = client.db("FPS_Stats").collection("game_stats");
    collection.insertOne(obj, {}, function(error, result){
        if(error){
            console.log("error occurred adding item: " +error);
            return;
        }
        sendTable(response);
    });
}
app.post("/add", [bodyParser.json(), convertDataToNum], addItem);

/**
 * Modify the row in the appdata table with the given id to instead
 * have the stats stored in <b>data</b>. This set of stats will keep
 * the unique ID number that was assigned to it when it was added.
 *
 * @param request the HTTP response contain the data to modify in the table
 * @param response the HTTP response to be populated with the results of
 *     the request
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

    //Have to use updateOne since each row will have a new kd ration and ad
    //ratio based on the stats that were no modified in their respective rows.
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

            update(0, -item.kills, -item.assists, -item.deaths);
            update(0, updatedObj.kills, updatedObj.assists, updatedObj.deaths);
            promises.push(game_stats.updateOne({_id: id}, {$set: updatedObj}));
        }
    }

    //Once all modifications have finished, safely send the new table
    Promise.all(promises).then(function(results){
        console.log("all modifications done, sending table");
        sendTable(response);
    });
}
app.post("/modify", [bodyParser.json(), convertDataToNum], modifyItem);

const valid = function(value){
    return (!isNaN(value) && value >= 0);
}

/**
 * Delete the row in the appdata table with the given id.
 *
 * @param request the HTTP response contain the ID of the row to delete
 *     from the table
 * @param response the HTTP response to be populated with the results of
 *     the request
 * @return {boolean} true on successful deletion, false otherwise.
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
    game_stats.deleteMany({_id: {$in: ids}}, function(error, result){
        if (error) {
            console.log("Error occurred during deletion: " + error);
        }else{
            sendTable(response);
        }
    });
}
app.post("/delete", [bodyParser.json(), convertDataToNum], deleteItem);
//////////////////////////////////////////////////////////////////////


/////////////////////// GET Request Handlers //////////////////////////
/**
 * Creates an HTTP response with a JSON object that contains all the data for the
 * total_avg_results and result_list tables in index.html. This includes every
 * row of appdata as well as total and average number of kills, assists and deaths.
 * This JSON object is then stored in <b>response</b> and the headers are set.
 *
 * The format of the JSON object is as follows:
 * {
 *     numRows: ,
 *     rows: [
 *         { "id": , "kills": , "assists": , "deaths": , "kd_ratio": , "ad_ratio": },
 *         ...
 *         { "id": , "kills": , "assists": , "deaths": , "kd_ratio": , "ad_ratio": },
 *     ],
 *     totals_avgs: {
 *         total_kills:
 *         avg_kills:
 *         total_assists:
 *         avg_assists:
 *         total_deaths:
 *         avg_deaths:
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
app.get('/results', function(request, response){
    sendTable(response);
});

const getAllStats = function(){
    let game_stats = client.db("FPS_Stats").collection("game_stats");
    return game_stats.find({}).toArray();
}

/**
 * Creates an HTTP response that contains the contents of a stats.csv file,
 * which is a csv file that contains every row of appdata as well as total
 * and average number of kills, assists and deaths. This response is then
 * stored in <b>response</b> and the headers are set.
 *
 * @param response an HTTP response that will be populated the data for stats.csv.
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

    file.write("ID #,Kills,Assists,Deaths,K/D Ratio,A/D Ratio\n");
    getAllStats().then(function(result){
        for(let i = 0; i < numEntries; i++){
            file.write(`${result[i]["id"]}, ${result[i]["kills"]}, ${result[i]["assists"]}, ${result[i]["deaths"]}, ${result[i]["kd_ratio"]}, ${result[i]["ad_ratio"]}\n`);
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
app.get('/csv', function(request, response){
    sendCSV(response);
});

/**
 * Wipe all the data stored on the server and reset count variables.
 * Return an a json indicating an empty table so index.html knows to
 * display and empty table.
 *
 * @param response an HTTP response that will be populate with an
 *     empty table to indicate that server data has been wiped.
 */
const clearStats = function(response){
    function handleClear(error, result){
        if(error){
            console.log("error occurred during clear: " +error);
        }
    }

    numEntries = 0;
    totalKills = totalAssists = totalDeaths = 0;
    avgKills = avgAssists = avgDeaths = 0;

    //Set all running stats back to zero
    let total = client.db("FPS_Stats").collection("totals");
    total.updateMany({type: {$in: ["kills", "assists", "deaths", "entries"]}}, {$set: {amount: 0}}, handleClear);

    let avgs = client.db("FPS_Stats").collection("averages");
    avgs.updateMany({type: {$in: ["kills", "assists", "deaths"]}}, {$set: {amount: 0}}, handleClear);

    //Clear the entire game_stats collection
    let game_stats = client.db("FPS_Stats").collection("game_stats");
    game_stats.deleteMany({}, handleClear);
    sendTable(response);
}
app.get('/clear', function(request, response){
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
 * Update the total and average kills, assists and deaths by taking into
 * account the new set of <b>kills</b>, <b>assists</b> and <b>deaths</b>.
 *
 * @param kills number of kills from the game
 * @param assists number of assists from the game
 * @param deaths number of deaths from the game
 */
const updateTotals = function(kills, assists, deaths){
    totalKills += kills;
    totalAssists += assists;
    totalDeaths += deaths;
    let totals = client.db("FPS_Stats").collection("totals");
    let promises = [];
    promises.push(totals.updateOne({type: "kills"}, {$inc: {amount: kills}}, {}));
    promises.push(totals.updateOne({type: "assists"}, {$inc: {amount: assists}}, {}));
    promises.push(totals.updateOne({type: "deaths"}, {$inc: {amount: deaths}}, {}));
    return Promise.all(promises);
}

/**
 * Update the average kills, assists and deaths based on the current number
 * of kills, assists and deaths.
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
    promises.push(avgs.updateOne({type: "kills"}, {$set: {amount: avgKills}}, {}));
    promises.push(avgs.updateOne({type: "assists"}, {$set: {amount: avgAssists}}, {}));
    promises.push(avgs.updateOne({type: "deaths"}, {$set: {amount: avgDeaths}}, {}));
    return Promise.all(promises);
}

const updateNumEntries = function(delta){
    numEntries += delta;
    let totals = client.db("FPS_Stats").collection("totals");
    return totals.updateOne({type: "entries"}, {$inc: {amount: delta}});
}

const update = function(entriesDelta, kills, assists, deaths){
    updateNumEntries(entriesDelta);
    updateTotals(kills, assists, deaths);
    updateAvgs();
}