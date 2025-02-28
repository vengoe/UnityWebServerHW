const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userid:{ type: String, unique:true},
    screenname:String,
    firstname:String,
    lastname:String,
    datestarted:Number,
    score:Number
})

const User = mongoose.model("User", userSchema);

module.exports = User