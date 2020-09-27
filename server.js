

const express = require( 'express' )
const bodyParser = require( 'body-parser' )
app     = express()

const tempData = [
    "test"
]


app.use( express.static('./'))

app.get( "/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html")
})

app.get( "/db", (request, response) => {
    response.json(tempData)
})

app.post( "/add", bodyParser.json(), (request, response) => {
    console.log(request.body)
    response.json(tempData)
})

const listener = app.listen(process.env.PORT, () => {
    console.log("Listening on port " + listener.address().port)
})