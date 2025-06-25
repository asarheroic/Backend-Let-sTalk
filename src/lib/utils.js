const {sign} = require( "jsonwebtoken")

 const generateToken = (userId ,res) =>{
    const token = sign({userId},process.env.JWT_SECRET,{
        expiresIn : "7d"
    })

    // res.cookie("jwt",token ,{
    //     maxAge : 7*24*60*60*1000 ,// ms
    //     httpOnly : true ,// cross site scripting attacks means cant access using js
    //     sameSite : "Lax",//csrf only links
        
    // })  working locally and will work on monorepo but when FE(vercel) and BE(render) it gives error to set cookies so 



    // secure: true is required when using sameSite: "None" — this ensures it only works on HTTPS (which Render and Vercel provide).
 

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",  // ✅ Needed for cross-origin cookies (Render <-> Vercel)
        secure: true       // ✅ Required when using sameSite: "None"
      })


    return token

}


module.exports = {generateToken}
