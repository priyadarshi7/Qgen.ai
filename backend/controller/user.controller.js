const mongoose = require("mongoose");
const { userModel } = require("../model/user.model");

//Store auth0 user
async function createUser(req,res){
    const {auth0Id, name, email, picture} = req.body;

    try{
        if(!auth0Id || !name || !email){
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let user = await userModel.findOne({auth0Id});

        if(user){
            return res.status(400).json({success:false, message: "User already exists"});
        }

        user = new userModel({ auth0Id, name, email, picture });
        await user.save();

        res.status(201).json({ success:true,message: "User stored successfully", user });
    }catch(error){
        console.error(error);
        res.status(500).json({ success:false, message: "Internal Server error" });
    }
}

//get user data
async function getUserData(req,res) {
    try{
        const user = await userModel.findOne({auth0Id: req.params.auth0Id});
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({success:true, message:"User found successfully",data: user});
    }catch(error){
        console.error(error);
        res.status(500).json({ success:false, message: "Internal Server error" });
    }
}

module.exports = {
    getUserData,
    createUser,
}