const MongoClient = require("mongodb").MongoClient;

const dbUser = "Jacob";
const dbPass = "abc123abc";
const dbName = "MusicianDatabase";
const uri = `mongodb+srv://${dbUser}:${dbPass}@a3-cluster.2f9fy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
let myDatabase;

MongoClient.connect(uri, (err, database) => {
    if (err) throw err;
    myDatabase = database;
});

async function findOrCreate(profile) {
    //check db for user
    let user = await myDatabase
        .db(dbName)
        .collection("github_users")
        .findOne({github_id: profile.id});

    if (user) {
        console.log(`User ${user.github_id} already registered.`)
        return user
    } else {
        console.log(`Creating new GitHub user ${profile.id}`);
        const newUser = await myDatabase
            .db(dbName)
            .collection("github_users")
            .insertOne({github_id: profile.id});
        return newUser.ops[0]
    }

}

async function getUserById(user_id) {
    const user = await myDatabase.db(dbName).collection('github_users').findOne({github_id: user_id})
    return user
}

async function findRecord(user_id, artist_name) {
    const foundRecord = await myDatabase.db(dbName).collection('artist_records').findOne({$and: [{github_id:user_id}, { artist:artist_name}]})
    return foundRecord
}


//add record to artist records
async function addRecord(record) {
    myDatabase
        .db(dbName)
        .collection('artist_records')
        .insertOne(record);

}


//add record to artist records
async function modifyRecord(oldRecord, newRecord) {

    console.log(oldRecord.github_id, oldRecord.artist)
    myDatabase
        .db(dbName)
        .collection('artist_records')
        .updateOne({$and: [{github_id:oldRecord.github_id},{artist: oldRecord.artist}]}, {$set: {artist:newRecord.artist, genre:newRecord.genre, birthdate:newRecord.birthdate,
                                                                                                deathdate:newRecord.deathdate, birthplace:newRecord.birthplace}});

}

//get user records
async function getUserRecords(user_id) {
    const userRecord = await myDatabase.db(dbName).collection('artist_records').find({github_id: user_id}).toArray()
    return userRecord
}

//get user records
async function getAllArtistRecords() {
    const userRecords = await myDatabase.db(dbName).collection('artist_records').find().toArray()
    return userRecords
}



//get user records
async function removeRecord(user_id, record) {
    const userRecord = await myDatabase.db(dbName).collection('artist_records').remove({$and: [{github_id:user_id},{artist:record.artistName}]})
    return userRecord
}



module.exports = {
    findOrCreate,
    addRecord,
    getUserRecords,
    findRecord,
    getUserById,
    modifyRecord,
    removeRecord,
    getAllArtistRecords
}