const express = require('express'); 
const mysql = require('mysql'); 
const userRoutes = require('./routes/user')
const app = express();

const db = mysql.createConnection({
    host:'localhost', 
    user:'root', 
    password:'',
    database:'P7_OC'
})

db.connect((error) => {
    if(error){
        console.log(error)
    } else{
        console.log('Connected to MySQL Database ...')
    }
})



app.use('/api/user', userRoutes);

module.exports = app;