const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const { nanoid } = require("nanoid");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors()); //Allows us to make requiests from our game.
app.use(bodyParser.json());


//Connection for MongoDB
mongoose.connect("mongodb+srv://michaelvengoe:Laugh!913@cluster0.lawpp.mongodb.net/GamesDB");//"mongodb://localhost:27017/gamedb");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});


  

app.get("/user", async (req,res)=>{
    try{
        const user = await User.find();
        if(!user){
            return res.status(404).json({error:"users not found"});
        }

        res.json(user);
        console.log(user);
    }
    catch(error){
        res.status(500).json({error:"Failed to retrieve users"})
    }
});

app.get("/user/:userid", async(req,res)=>{
    console.log(req.params.userid);
    try{

        const user = await User.findOne({userid:req.params.userid});

        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user);

    }
    catch(error)
    {
        res.status(500).json({error:"Failed to retrieve user"})
    }
});


app.get("/user/:screenname", async(req,res)=>{
    console.log(req.params.screenname);
    try{

        const user = await User.findOne({screenname:req.params.screenname});

        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user);

    }
    catch(error)
    {
        res.status(500).json({error:"Failed to retrieve user"})
    }
});
app.post("/sentdata", (req,res)=>{
    const newUserData = req.body;

    console.log(JSON.stringify(newUserData,null,2));

    res.json({message:"User Data recieved"});
});

app.post("/sentdatatodb", async (req,res)=>{
    try{
        const newUserData = req.body;

        console.log(JSON.stringify(newUserData,null,2));

        const newUser = new User({
            userid: nanoid(8),
            screenname:newUserData.screenname, 
            firstname:newUserData.firstname,
            lastname:newUserData.lastname,
            datestarted:newUserData.datestarted,
            score:newUserData.score
        });
        
        
        //save to database
        await newUser.save();
        res.json({message:"User Added Successfully",userid:newUser.userid, screenname:newUser.screenname});
    }
    catch(error){
        res.status(500).json({error:"Failed to add user"})
    }
    
    
});


//old update:
app.post("/updateUsers", async(req, res) => {
    
    const userData = req.body;

    const user = await User.findOne({ screenname: userData.screenname });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.datestarted = userData.datestarted;
    user.score = userData.score;

    await user.save();

    res.json({ message: "user updated", user });
});


app.put("/updateuser/:userid", async (req, res) => {
    const userID = req.params.userid;
    const userData = req.body;

    try {

        const user = await User.findOneAndUpdate(
            { userid: userID },
            { $set: userData },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete User 
app.delete("/deleteuser/:userid", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userid: req.params.userid });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user." });
    }
});

  app.listen(3000, ()=>{
    console.log("Running on port 3000");
})