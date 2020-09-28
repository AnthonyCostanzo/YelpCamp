var mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    price : String,
    author : {
        id : {
            type:mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username:String
    },
    comments : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


var Campground = mongoose.model("Campground",CampgroundSchema);
module.exports = Campground;