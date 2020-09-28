var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds")
var middlewareObj = require("../middleware/mid")
router.get("/",(req,res)=>
{
    Campground.find({},(err,campgrounds)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('campgrounds/index',{campgrounds:campgrounds})
        }
    })
    
})

router.post("/",middlewareObj.isLoggedIn,(req,res)=>
{
    let name = req.body.name;
    let img = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    var author = {id : req.user._id, username:req.user.username}
    let campground = {name:name,image:img,description:description,price:price,author : author};
    Campground.create(campground,(err,campground)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds")
        }
    })
})

router.get("/new",middlewareObj.isLoggedIn,(req,res)=>
{
    res.render("campgrounds/new");
});

router.get("/:id",(req,res)=>
{
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show",{campground:foundCampground})
        }
    })
    });

router.get("/:id/edit",middlewareObj.checkCampgroundOwnership,(req,res)=>
{
    Campground.findById(req.params.id,(err,foundCampground)=>
        {
           res.render('campgrounds/edit',{campground:foundCampground})
        });
    });

router.put("/:id",middlewareObj.checkCampgroundOwnership,(req,res)=>
{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>
    {
        if(err)
        {
            res.redirect('/campgrounds');
        }else
        {
            res.redirect('/campgrounds/'+ req.params.id);
        }
    })
})

router.delete("/:id",middlewareObj.checkCampgroundOwnership,(req,res)=>
{
    Campground.findByIdAndRemove(req.params.id,(err)=>
    {
        if(err)
        {
            res.redirect('/campgrounds');
        }
        else
        {
            res.redirect('/campgrounds');
        }
    })
})

module.exports = router;