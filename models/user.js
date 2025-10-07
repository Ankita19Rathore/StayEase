const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
    email : {
        type:String,
        required:true
    }
});
//to hash and salt the password and save the username and the hashed password in the database
userSchema.plugin(passportLocalMongoose);
//add username and password fields to userSchema
module.exports=mongoose.model("User", userSchema);
