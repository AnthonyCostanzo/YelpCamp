var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments")
var comments = require("./models/comments");
var seedDB = require("./seeds");
var passport = require("passport"),
    localStrategy = require("passport-local");
    User = require("./models/user");
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth"),
    methodOverride = require("method-override"),
    flash = require('connect-flash');

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
    secret:"Anthony is the best",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next)
{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
})
app.use(authRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);

app.listen(3000,console.log("Listening on Port:3000"))