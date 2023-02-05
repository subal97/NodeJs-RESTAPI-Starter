const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/indexRouter')
const apiRouter = require('./routes/api')

const app = express();

//Only parses JSON data i.e. Content-Type must match application/json
app.use(bodyParser.json());

//parser data from url
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api/v1/", apiRouter);

module.exports = app;