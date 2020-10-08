//Définition des modules
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//connexion à la base de données
mongoose.connect('mongodb+srv://root:root@tiketcluster.jemx1.mongodb.net/ticketdbnam?retryWrites=true&w=majority',
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

//On définit notre objet express nommé app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');

// public folder for static resources
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
	extended: true
});

app.use(session({
	secret: 'MERRYCHRISTMAS',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection })
}));

app.use(urlencodedParser);
app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

//Définition du routeur
var userRouter = require(__dirname + '/routes/userController');
app.use('/user', userRouter);
var ticketRouter = require(__dirname + '/routes/ticketController');
app.use('/ticket', ticketRouter);
app.get('/',function(req,res){
    var connecte = req.session.userid ? true : false;
    res.status(200).render('account/index', {title: 'Bienvenue sur le site de gestion de tickets',connecte});
});
//Définition et mise en place du port d'écoute
var port = 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
