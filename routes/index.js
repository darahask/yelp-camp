var express = require('express');
var router = express.Router({mergeParams:true});
var User = require('../models/user');
var passport = require('passport');

router.get("/",(req,res)=>{
    res.render("landing");
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',passport.authenticate('local',{successRedirect:'/campgrounds',failureRedirect:'/login'}),(req,res)=>{

});

router.get('/logout',(req,res)=>{
    req.flash('success','Logged you out');
    req.logout();
    res.redirect('/campgrounds');
})

module.exports= router;