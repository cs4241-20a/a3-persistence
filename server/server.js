import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import passportHttp from 'passport-http';
import { getCollection } from './db.js';
import expressStaticGzip from 'express-static-gzip';
import cors from 'cors';
import helmet from 'helmet';

const { BasicStrategy } = passportHttp;

const PORT = process.env.PORT || 3000;
const app = express();

let __users_loaded_cb;
const usersLoaded = new Promise((resolve) => __users_loaded_cb = resolve);
/** @type {import('mongodb').Collection<import('../src/js/types/user').User>} */ let users;
getCollection('users').then(_users => {users = _users; __users_loaded_cb()});
let __messages_loaded_cb;
const messagesLoaded = new Promise((resolve) => __messages_loaded_cb = resolve);
/** @type {import('mongodb').Collection<Omit<import('../src/js/types/message').Message, 'id'>>} */ let messages;
getCollection('messages').then(_messages => {messages = _messages; __messages_loaded_cb()});

const jsonBodyParser = bodyParser.json();

passport.use(new BasicStrategy(
    async (username, hash, done) => {
        await usersLoaded;
        const user = await users.findOne({username, authKind: 'local', hash}, {projection: {_id: 0}});
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
));
/** @type {Parameters<typeof passport.authenticate>} */ const basicAuthArgs = ['basic', {session: false, failWithError: true}];

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());

app.post('/api/register', jsonBodyParser, async (req, res) => {
    await usersLoaded;
    const {username, displayName, authKind, hash} = req.body;
    if (authKind !== "local") {
        return res.status(400).send("The /api/register endpoint is only for local accounts");
    }
    if (username == null || hash == null || displayName == null) {
        return res.status(400).send("Missing field(s)");
    }
    else if (username.match(/^[a-z_][a-z0-9_]{3,}$/) === null || displayName.match(/^\S(.*\S)?$/) == null) {
        return res.status(400).send("Invalid field(s)");
    }
    else if (await users.findOne({username})) {
        return res.status(400).send("User already exists");
    }
    const user = {username, authKind, hash, displayName};
    users.insertOne(user);
    res.json(user);
});

app.get('/api/me', passport.authenticate(...basicAuthArgs), (req, res) => {
    res.json(req.user);
});

app.get('/api/users', passport.authenticate(...basicAuthArgs), async (req, res) => {
    await usersLoaded;
    const _users = await users.find({}, {projection: {_id: 0, username: 1, displayName: 1}}).toArray();
    res.json(_users);
});

function docMsgToMsg(msg) {
    return {
        id: msg._id,
        author: msg.author,
        to: msg.to,
        timestamp: msg.timestamp,
        contents: msg.contents
    };
}

app.post('/api/message', jsonBodyParser, passport.authenticate(...basicAuthArgs), async (req, res) => {
    await messagesLoaded;
    const {to, contents} = req.body;
    if (to == null || contents == null) {
        return res.status(400).send("Missing field(s)");
    }
    if (contents === "") {
        return res.status(400).send("Cannot send an empty message");
    }
    if (!(await users.findOne({username: to}))) {
        return res.status(400).send("Target user does not exist");
    }
    const msg = await messages.insertOne({author: req.user.username, to, contents, timestamp: Math.floor(+(new Date()) / 1000)});
    res.json(msg.ops.map(docMsgToMsg));
});

app.get('/api/conversation/:user', passport.authenticate(...basicAuthArgs), async (req, res) => {
    await messagesLoaded;
    const otherUser = req.params.user;
    const query = messages.find({
        $or: [
            { author: req.user.username, to: otherUser },
            { author: otherUser, to: req.user.username }
        ]
    }, { sort: { timestamp: 1 } });
    const msgs = (await query.toArray()).map(docMsgToMsg);
    res.json(msgs);
});

app.use('/', expressStaticGzip("../dist", {
    enableBrotli: true,
    orderPreference: ['br']
}));

app.use(/** @type {express.ErrorRequestHandler} */(err, req, res, next) => {
    switch (err.name) {
        case "AuthenticationError":
            res.removeHeader("www-authenticate");
            return res.contentType('text/plain').status(err.status).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log("Server started on http://localhost:" + PORT);
});
