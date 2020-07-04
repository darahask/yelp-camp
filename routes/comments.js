var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/camps');
var Comment =  require('../models/comments');
const { checkCommentOwnership, isLoggedIn } = require('../middleware/index');

router.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.render('newcomment',{camp:camp});
        }
    });
});

router.post('/campgrounds/:id/comments',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            })
        }
    })
});

router.get('/campgrounds/:id/comments/:cid/edit',checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.cid,(err,c)=>{
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit',{id:req.params.id,c:c});
        }
    });
});


router.put('/campgrounds/:id/comments/:cid',checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,(err,c)=>{
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

router.delete('/campgrounds/:id/comments/:cid',checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndDelete(req.params.cid,(err,doc)=>{
        if(err){
            res.redirect('/campgrounds/'+req.params.id);
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

// function isLoggedin(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }

module.exports = router;