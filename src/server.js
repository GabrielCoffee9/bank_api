require('dotenv').config({ path: __dirname + './env' })
const express = require('express')
const routes = require('./routes/routes')
require('./database')


const app = express()

app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 4242)