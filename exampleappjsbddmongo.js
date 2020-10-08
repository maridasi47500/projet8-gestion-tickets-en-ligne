const express=require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//connexion à la base de données
mongoose.connect('lienmongo',
{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
 console.log('Connected to mongodb');   
}).catch(e=>{
    console.log('Error while connecting');
    console.log(e);
});

//on définit notre objet express app
const app=express();

//view engine setup
app.set('views',path.join(__dirname,'/views/'));
app.set('view engine','ejs');

//public folder for static resource