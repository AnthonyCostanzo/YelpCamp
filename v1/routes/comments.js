var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds")
var Comment = require("../models/comments");
var middlewareObj = require('../middleware/mid');

router.get("/new",middlewareObj.isLoggedIn,(req,res)=>
{
    Campground.findById(req.params.id,(err,campground)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new",{campground:campground})
        }
    })
})

router.post("/",middlewareObj.isLoggedIn,(req,res)=>
{
    Campground.findById(req.params.id,(err,campground)=>
    {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds")
        }
        else
        {
           Comment.create(req.body.comment,(err,comment)=>
           {
               if(err)
               {
                   req.flash("error","something went wrong")
                   console.log(err);
               }
               else
               {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success","Succesfully added comment")
                   res.redirect('/campgrounds/' + campground._id);
               }
           })
        }
    })
})

router.get("/:comment_id/edit",middlewareObj.checkCommentOwnership,middlewareObj.isLoggedIn,(req,res)=>
{
    Comment.findById(req.params.comment_id,(err,comment)=>
    {
        if(err)
        {
            res.redirect('back');
        }
        else
        {
            res.render('comments/edit',{campground_id:req.params.id,comment:comment})
        }
    })
})

router.put("/:comment_id",middlewareObj.checkCommentOwnership,(req,res)=>
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,campground)=>
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete('/:comment_id',middlewareObj.checkCommentOwnership,(req,res)=>
{
    Comment.findByIdAndRemove(req.params.comment_id,(err,removed)=>
    {
        if(err)
        {
            res.redirect('back')
        }
        else
        {
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

module.exports = router;