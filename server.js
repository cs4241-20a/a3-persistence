const express = require("express")
const app = express()

app.use(express.static("/views/index.html"))