const cloudinary  = require("../lib/cloudinary")
const { getReciverSocketId ,io} = require("../lib/socket")
const Message = require("../models/message.model")
const User = require("../models/user.model")


const getUsersForSidebar = async (req,res) => {

try {
    const loggedUserId = req.user._id

    const filterUsers = await User.find({_id : {$ne :loggedUserId}}).select("-password")
    res.json(filterUsers)
} catch (error) {
    console.log("error in getUserForSidebar controller",error);
      res.status(500).json({
        error : "Internal server error"
      })
     
}
}


const getmessages = async (req,res) => {
  try {
    const {id : userToChatId} = req.params
    const myId = req.user._id

    const messages = await Message.find({
        $or :[
            {senderId : userToChatId , receiverId : myId},
            {senderId : myId , receiverId : userToChatId} 
        ]
    })

    res.json(messages)



  } catch (error) {
    console.log("error in getmessages controller",error);
      res.status(500).json({
        error : "Internal server error"
      })
  }
}


const sentMessages = async (req,res) => {
  
    const {text,image} = req.body
    const {id : receiverId} = req.params
    const senderId = req.user._id
    
    let imageurl;
    if(image){
        // we need to upload it to cloud
        const uploadImageRes = await cloudinary.uploader.upload(image)
        imageurl = uploadImageRes.secure_url

    }
    try { 
    const sendMsg = await Message.create({
        senderId,
        receiverId,
        text,
        image : imageurl

    })


   const receiverSocketId =  getReciverSocketId(receiverId)

   if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage',sendMsg)
   }
   

    res.json(sendMsg)
  } catch (error) {
    console.log("error in sentmessage controller",error);
      res.status(500).json({
        error : "Internal server error"
      })
  }
}



module.exports = {getUsersForSidebar,getmessages,sentMessages}
