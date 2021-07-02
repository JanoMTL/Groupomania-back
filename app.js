const express = require('express'); 
const { sequelize } = require('./models/index'); 

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

const app = express();

const cors = require ('cors')

require('dotenv').config();

app.use (express.urlencoded ({ extended: true }));
app.use(express.json()); 
app.use(cors());


app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


const dbTest = async function () {
    try {
      await sequelize.authenticate();
      console.log('Connection à la base de donnée réussie');
    } catch (error) {
      console.error('connexion à la base de donnée impossible', err);
    }
  };
  dbTest();


module.exports = app;