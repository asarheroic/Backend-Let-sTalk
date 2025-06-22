const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    name:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true,
        minlength : 6
    },
    profilePic:{
        type : String,
        default : ""
    },
    

},{timestamps : true})

const User = mongoose.model('User',userSchema)

module.exports = User