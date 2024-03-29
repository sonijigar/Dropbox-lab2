var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./routes/kafka/client');

var mongo = require("./routes/mongo");
var routes = require('./routes/index');
var users = require('./routes/users');
var file = require('./routes/files');
var mongoSessionURL = "mongodb://localhost:27017/login";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: true,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 3 * 60 * 60,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL,
        ttl: 3*60*60
    })
}));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);
app.use('/files', file)

app.post('/logout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

// app.post('/signup', function(req, res){
//     pasport
// })
app.post('/signup', function(req, res) {
   kafka.make_request('signup_topic', {"operation":"signup","username":req.body.username, "password":req.body.password, "email":req.body.email, "phone":req.body.phone}, function(err, results){
        if (results.code == 200) {
            //done(null, results.user);
            console.log(results )
            req.session.user = results;
            req.session.cookie.maxAge = 30 * 60 * 1000;
            console.log(results);
            var ob = results.user;
            ob.stat = "logged in";
            res.status(201).json(ob);
        }
        else {
            res.status(400).send();
        }
    })
});



app.post('/check', function(req, res){
    if(req.session && req.session.cookie.expires){
        console.log("session:",req.session);

        res.status(201).send();

    }
    else{
        res.status(401).send();
    }
})
app.post('/login', function(req, res) {
    console.log('sess:', req.body);
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(401).send();
        }
        else{
            req.session.user = user;
            req.session.cookie.maxAge = 30 * 60 * 1000;
            console.log('sessionssss:::', req.session);
            console.log("session initilized");
            var obj = user;
            obj.stat = "logged in";
            console.log(obj);
            return res.status(201).json(obj);
        }

    })(req, res);
});

module.exports = app;
