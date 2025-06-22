const { verify } = require("jsonwebtoken")
const User = require("../models/user.model")

const authMiddleware = async (req,res,next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({
            error : "Not authrozied"
        })
    }

    const decode = verify(token,process.env.JWT_SECRET)

    if(!decode){
        return res.status(401).json({
            error : "Invalid token"
        })
    }


    const user = await User.findById(decode.userId).select("-password")
    if (!user) {
        return res.json({error : "User does not exist"})
    }

    req.user = user
    next()



    
  } catch (error) {
    console.log("Something wrong with authmiddler ");
    return res.status(500).json({
        error : "Internal server error"
    })
  }
}

module.exports = {authMiddleware}
