var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var User = require('./models/user');
var express = require("express");
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost/yelpcamp3",{useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('public'));
// seedDB(); //seed database;   
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret: "Cool kid",
    resave:false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser1 = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

app.listen(3000,()=>{
    console.log('Server Started');
});