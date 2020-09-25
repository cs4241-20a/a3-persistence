const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const app = express()


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

var appdata = []

// Serve files to index.html
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/node_modules'));

// Set default path as index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

// Send results to server
app.get('/results', (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(appdata))
})

// Add new entry to appdata 
app.post('/add', (req, res) => {
    if (!isDuplicate(req.body)) {
        req.body = addPriority(req.body)
        appdata.push(req.body)
        res.writeHead(200, "OK")
        res.end(JSON.stringify(req.body))
    } else {
        res.writeHead(200, "DUPLICATE", {
            "Content-Type": "application/json"
        })
        res.end(JSON.stringify(req.body))
    }
})

app.post('/delete', (req, res) => {
    for (result in req.body) {
        console.log("result in client array: " + req.body[result])
        for (obj in appdata) {
            // Object is a match if first four fields match 
            if (appdata[obj].billName == req.body[result].billName && appdata[obj].billAmt == req.body[result].billAmt && appdata[obj].date == req.body[result].date && appdata[obj].billPay == req.body[result].billPay) {
                // Remove from app data
                appdata.splice(obj, 1)
            }
        }
    }
    res.writeHead(200, "OK")
    res.end()
})

app.post('/edit', (req, res) => {
    appdata = req.body
    res.writeHead(200, "OK")
    res.end()
})

function isDuplicate(data) {
    // Iterate over appdata to search for matching entries 
    for (obj in appdata) {
        // Object is a match if first four fields match 
        if (appdata[obj].billName == data.billName && appdata[obj].billAmt == data.billAmt && appdata[obj].date == data.date && appdata[obj].billPay == data.billPay) {
            return true
        }
    }
    return false
}

// Calculate bill priorty on a scale of 1-3 based on amount, date, and if it has been paid
function addPriority(data) {

    // If data is single entry (not in an array), add prioirty to JSON obj
    if (data.length == undefined) {
        // If bill has been paid already
        if (data.billPay) {
            data.priority = '1'
        } else {
            // Calculate days since bill was issued
            var today, date;
            today = new Date();
            date = new Date(data.billDate);
            var res = Math.abs(today - date) / 1000;
            var daysSinceBill = Math.floor(res / 86400);

            // If bill was issued over 3 weeks ago, set to level 2
            if (daysSinceBill > 21) {
                data.priority = '3'
            } else {
                data.priority = '2'
            }
        }
    }
    // If data has length (aka multiple entries in an array)
    else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].billPay) {
                data[i].priority = '1'
            } else {
                var today, date;
                today = new Date();
                date = new Date(data[i].billDate);
                var res = Math.abs(today - date) / 1000;
                var daysSinceBill = Math.floor(res / 86400);
                if (daysSinceBill > 21) {
                    data[i].priority = '3'
                } else {
                    data[i].priority = '2'
                }
            }
        }
    }
    return data
}

app.listen(3000)