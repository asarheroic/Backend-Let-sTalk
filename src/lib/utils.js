const {sign} = require( "jsonwebtoken")

 const generateToken = (userId ,res) =>{
    const token = sign({userId},process.env.JWT_SECRET,{
        expiresIn : "7d"
    })

    res.cookie("jwt",token ,{
        maxAge : 7*24*60*60*1000 ,// ms
        httpOnly : true ,// cross site scripting attacks means cant access using js
        sameSite : "Lax",//csrf only links
        
    })
    return token

}


module.exports = {generateToken}