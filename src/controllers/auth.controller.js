const { z, optional } = require("zod");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { verify, sign } = require("jsonwebtoken");
const { config } = require("dotenv");
const { generateToken } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

config()


 
 
const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
   name: z.string().min(1, { message: "Full name is required" }).max(100, { message: "Full name is too long" })
   
  });
 const signup = async (req,res) => {
  try {
    const {name,email,password} = req.body
    const {success} = signupSchema.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            error : "invalid creds"
        })
    }
    const user  = await User.findOne({email})
    if(user){return res.status(400).json({error : "Email already exist"})}

    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password,salt)


    
        const createdUser  = await User.create({
            name,
            email,
            password : hashpassword,
            
        })
        const userId = createdUser._id


        generateToken(userId,res);

    
        return res.json({
          msg : "Signup successfully",
          _id : createdUser._id,
          name : createdUser.name,
          email : createdUser.email,
          profilePic :createdUser.profilePic
          
        })
      }
     catch (error) {
        console.log("somethig wrong with signup controller  ",error);
        return res.status(500).json({error : "internal server error"})
    }

  }

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  })

 const login = async (req,res) => {
    const {email,password} = req.body
    const {success} = loginSchema.safeParse(req.body)

    if(!success){
      return res.status(411).json({
          error : "invalid creds"
      })
  }

 
  const loggedInUser = await User.findOne({email})
try {
  if(!loggedInUser) { 
    return res.status(403).json({
      error : "Email does not exist"
  })
  }

  const isPasswordCorrect = await bcrypt.compare(password,loggedInUser.password)

  if(!isPasswordCorrect){
    return res.status(400).json({
      error : "Incorrect credentials"
    })
  }
  


  const userId = loggedInUser._id

  generateToken(userId,res)

  return res.json({
    msg : "You are logged in",
    _id : loggedInUser._id,
    name : loggedInUser.name,
    email : loggedInUser.email,
    profilePic :loggedInUser.profilePic
    
  })

 } catch (error) {
  console.log("error in login controller",error);
  res.status(500).json({
    error : "Internal server error"
  })
 }

  


  }
 const logout = (req,res) => {
    try {
      res.clearCookie("jwt")
      res.json({
        msg :"You are logged out"
      })
    } catch (error) {
      console.log("error in logout controller" ,error);
      res.status(500).json({
        error : "Can't be logged out"
      })
     }
  }

  const update = async (req,res) => {
    try {
      const {profilePic} = req.body
      const userId = req.user._id
      
      if(!profilePic){return res.status(400),json({
        message : "profile pic not provided"
      })}

    const uploadResponse =   await cloudinary.uploader.upload(profilePic)

    const updateUser = await User.findByIdAndUpdate(userId , {profilePic : uploadResponse.secure_url},{new : true})

    res.json(
      updateUser
    )

    } catch (error) {
      console.log("error in update controller" ,error);
      res.status(500).json({
        error : "Internal server error"
      })
     }
  


  }


  const checkAuth = (req,res) => {
    try {
      res.status(200).json(
        req.user
      )
    } catch (error) {
      console.log("error in checkAuthcontroller",error);
      res.status(500).json({
        error : "Internal server error"
      })
     }
    }
  
  
  


  module.exports = {signup, login , logout,update,checkAuth}