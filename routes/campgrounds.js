var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/camps');
var checks = require('../middleware/index')

router.get("/campgrounds",(req,res)=>{
    Campground.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds",{campgrounds:data, currentrUser: req.user});
        }
    });
});

router.post("/campgrounds",(req,res)=>{
    Campground.create(req.body.camp,(err,camp)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
            var author = {
                id:req.user._id,
                username:req.user.username
            }
            camp.author = author;
            camp.save();
            console.log(camp);
            res.redirect('/campgrounds');
        }
    });
});

router.get("/campgrounds/new",(req,res)=>{
    res.render('new');
});

router.get("/campgrounds/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(
        (err,camp)=>{
            if(err){
                console.log(err);
            }else{
                res.render('disp',{camp:camp});
            }
        }
    );
});

router.get('/campgrounds/:id/edit',checks.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.render('campgrounds/edit',{camp:camp});
        }
    });
});

router.put("/campgrounds/:id", checks.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.camp,(err,campnew)=>{
        if(err){
            res.redirect('/campgrounds');
        }else{
            
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id",checks.checkCampgroundOwnership, (req,res)=>{
    Campground.findByIdAndDelete(req.params.id,(err,campnew)=>{
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;