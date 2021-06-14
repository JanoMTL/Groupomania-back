const express = require('express');  
const userRoutes = require('./routes/user')
const app = express();

const cors = require ('cors')

app.use (express.urlencoded ({ extended: true }));
app.use(express.json()); 






module.exports = app;