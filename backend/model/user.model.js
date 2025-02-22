const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    auth0Id: { 
        type: String, required: true, unique: true 
    },
    name: String,
    email: { 
        type: String, unique: true, required: true 
    },
    picture: String,
    createdAt: { 
        type: Date, default: Date.now 
    },
}, {timestamps:true})

const userModel = mongoose.model("user", userSchema);
module.exports = {userModel};