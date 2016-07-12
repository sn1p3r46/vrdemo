/* jslint node: true */
"use strict";
/**
 * Module dependencies
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path'),
    jwt = require('express-jwt');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('password', process.env.PASSWORD || 'password');
app.set('private_key', process.env.PRIVATE_KEY || 'asdkj3428isakksjwjwe8d8salkj');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if ('development' == app.get('env')) {
    console.log("development");
    app.set('mongodb_uri', 'mongo');
}

// production only
if ('production' == app.get('env')) {
    console.log("production");
    app.set('mongodb_uri', 'localhost');
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + app.get('mongodb_uri') + '/personal', function(err) {
    if (err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
        if ('development' == app.get('env')) {
            var test = require('./test/testdata.js');
            test.me();
            test.education();
            test.experience();
            test.projects();
            test.skills();
        }
    }
});


var api = {
    me: require('./routes/api/me'),
    //curriculum: require('./routes/api/curriculum'),
    experience: require('./routes/api/experience'),
    education: require('./routes/api/education'),
    projects: require('./routes/api/projects'),
    projectsCat: require('./routes/api/projects-category'),
    skills: require('./routes/api/skills'),
    skillsCat: require('./routes/api/skills-category'),
    latex: require('./routes/api/latex')
};



app.use(jwt({
    secret: app.get('private_key')
}).unless({
    method: ['GET'],
    path: ['/api/authenticate']
}));

app.use('/api/authenticate', require('./routes/authenticate'));
app.use('/api/me', api.me);
app.use('/api/experience', api.experience);
app.use('/api/education', api.education);
app.use('/api/projects', api.projects);
app.use('/api/projectscat', api.projectsCat);
app.use('/api/skills', api.skills);
app.use('/api/skillscat', api.skillsCat);
app.use('/api/latex', api.latex);

// redirect all others to the index (HTML5 history)
//app.use('*', index);

app.use('*', function(req, res, next) {
    res.sendfile(__dirname + '/public/index.html');
});

/**
 * ERROR
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (env === 'production') {
    console.log('error_production');
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status = (err.status || 500));
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
} else {
    console.log('error_development');
    app.use(errorhandler());
}

// production only


var server = app.listen();
