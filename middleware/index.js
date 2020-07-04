var Campground = require('../models/camps');
var Comment = require('../models/comments')

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,camp)=>{
            if(err){
                req.flash('error','Campground not found');
                res.redirect("back");
            }else{
                if(camp.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error','You need to be logged in')
        res.send('back');
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid,(err,c)=>{
            if(err){
                req.flash('error','Comment not found');
                res.redirect("back");
            }else{
                if(c.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error','You need to be logged in')
        res.send('back');
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login First!')
    res.redirect('/login');
}

module.exports = middlewareObj;