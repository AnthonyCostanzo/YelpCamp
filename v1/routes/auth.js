var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",(req,res)=>
{
    res.render("landing");
})

router.get("/register",(req,res)=>
{
    res.render("register")
})

router.post('/register',(req,res)=>
{
    User.register(new User({username : req.body.username}),req.body.password,(err,user)=>
    {
        if(err)
        {
            req.flash("error",err);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function()
        {
            req.flash("success", `welcome to yelpcamp ${user.username}`)
            res.redirect("/campgrounds");
        })
    })
}
)

router.get("/login",(req,res)=>
{
    res.render("login")
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),(req,res)=>
{

})

router.get("/logout",(req,res)=>
{
    req.logout();
    req.flash("success","You are logged out")
    res.redirect('/campgrounds');
})

function isloggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/login');
}

module.exports = router; 